import axios from "axios";
import * as cheerio from "cheerio";
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

// --- Interfaces ---
interface FetchPageResult {
    data: string;
    status: number;
}

interface ExtractionResult {
    text: string;
    googleScholarLink: string;
}

interface Context {
    tooManyRequests: boolean;
    currentDepth: number;
    recursionLimit: number;
    unresolvedCitations: Set<string>;
    requestDelay: number; // Delay in milliseconds between requests
}

interface CitationObj {
    href: string;
    page: string;
    year: string;
    volume: string;
}

// --- Context Initialization ---
const context: Context = {
    tooManyRequests: true,
    currentDepth: 0,
    recursionLimit: 1,  // Adjust this value for your desired recursion limit
    unresolvedCitations: new Set<string>(),
    requestDelay: 2000 // 2 seconds delay between requests
};

// --- Utility Functions ---
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Data Fetching ---
async function fetchPage(url: string, ctx: Context, retries = 3): Promise<FetchPageResult | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url);
            return { data: response.data, status: response.status };
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(`Axios error fetching URL ${url} (attempt ${attempt}):`, error.message);
                if (attempt === retries) return null;
            } else if (error instanceof Error) {
                console.error(`Unknown error fetching URL ${url} (attempt ${attempt}):`, error.message);
                if (attempt === retries) return null;
            } else {
                console.error(`Unexpected error fetching URL ${url} (attempt ${attempt}):`, error);
                if (attempt === retries) return null;
            }
        }
        await sleep(ctx.requestDelay); // Delay between retries
    }
    return null;
}

// --- Text Extraction & Parsing ---
function extractTextAndGoogleScholarLink(html: string): ExtractionResult {
    const $ = cheerio.load(html);
    const text = $('.-display-inline-block.text-left').text();
    const googleScholarLink = $('a:contains("Google Scholar")').attr('href') || '';
    return { text, googleScholarLink };
}

function extractCitations(text: string): string[] {
    const citationRegex = /(\d+)\s+U\.?\s*S\.?\s*(\d+)/g;
    const matches = Array.from(text.matchAll(citationRegex));
    const uniqueCitations = new Set(matches.map(match => `${match[1]} U.S. ${match[2]}`));
    return Array.from(uniqueCitations).sort((a, b) => parseInt(a.split(' ')[0]) - parseInt(b.split(' ')[0]));
}

function extractOwnCitation(citationObj: CitationObj): string {
    if (citationObj?.volume && citationObj?.page) {
        return `${citationObj.volume} U.S. ${citationObj.page}`;
    }
    return 'NOT FOUND';
}

async function getGoogleScholarCaseLink(link: string, ctx: Context): Promise<{ link: string; ctx: Context }> {
    if (!link || ctx.tooManyRequests) return { link, ctx };

    const fetchResult = await fetchPage(link, ctx);
    if (!fetchResult) {
        ctx.tooManyRequests = true;
        return { link, ctx };
    }

    const { data, status } = fetchResult;
    if (status === 429) {
        console.debug('Too many requests to Google Scholar. Skipping remaining cases...');
        ctx.tooManyRequests = true;
        return { link, ctx };
    }

    const $ = cheerio.load(data);
    const scholarLink = 'https://scholar.google.com' + ($('.gs_rt > a').first().attr('href') || link);
    return { link: scholarLink, ctx };
}

async function getCaseNameByCitation(citation: CitationObj): Promise<string | null> {
    const caseResult = await prisma.supreme_court_cases.findFirst({
        where: {
            AND: [
                {
                    citation: {
                        path: ['volume'],
                        equals: citation.volume
                    }
                },
                {
                    citation: {
                        path: ['page'],
                        equals: citation.page
                    }
                }
            ]
        },
        select: {
            name: true
        }
    });

    return caseResult?.name || null;
}

async function createCaseCitation(selfId: string, citation: string, targetUuid: string | null) {
    await prisma.cases_citations.create({
        data: {
            self_id: selfId,
            self_citation: citation,
            target_uuid: targetUuid
        }
    });
}

async function processCase(caseItem: any, ctx: Context) {
    if (ctx.currentDepth > ctx.recursionLimit) {
        console.debug('Recursion limit reached');
        return;
    }

    if (!caseItem.justia_url) {
        console.error('No URL found for case:', caseItem);
        return;
    }

    const fetchResult = await fetchPage(caseItem.justia_url, ctx);
    if (!fetchResult) {
        console.error(`Failed to fetch case page for case ${caseItem.name}`);
        return;
    }

    const { data, status } = fetchResult;
    if (status !== 200) {
        console.error(`Failed to fetch case page with status: ${status}`);
        return;
    }

    const { text, googleScholarLink } = extractTextAndGoogleScholarLink(data);
    const updatedGoogleScholarLink = ctx.tooManyRequests
        ? { link: googleScholarLink, ctx }
        : await getGoogleScholarCaseLink(googleScholarLink, ctx);

    const thisCitation = extractOwnCitation(caseItem.citation as CitationObj);
    const citations = extractCitations(text);
    if (thisCitation !== 'NOT FOUND' && citations.includes(thisCitation)) {
        citations.splice(citations.indexOf(thisCitation), 1);
    }

    const citationDetails = await Promise.all(
        citations.map(async (citation) => {
            const [volume, , page] = citation.split(' ');
            const citationObj: CitationObj = {
                href: '',
                page: page,
                year: '',
                volume: volume
            };
            const caseName = await getCaseNameByCitation(citationObj);
            if (!caseName) {
                ctx.unresolvedCitations.add(citation);
                return null;
            }
            return {
                citation,
                caseName,
                googleScholarLink: updatedGoogleScholarLink.link
            };
        })
    );

    for (const detail of citationDetails) {
        if (detail) {
            console.log(`${caseItem.name} cites ${detail.citation} - ${detail.caseName}\nGoogle Scholar Link: ${detail.googleScholarLink}\n`);
            await createCaseCitation(caseItem.id, detail.citation, caseItem.id);
            const newContext = { ...ctx, currentDepth: ctx.currentDepth + 1 };
            await processCitationsRecursively(detail.citation, newContext);
        }
    }

    // Your logic to add citations to the database
}

async function processCitationsRecursively(citation: string, ctx: Context) {
    if (ctx.currentDepth > ctx.recursionLimit) {
        console.debug('Recursion limit reached');
        return;
    }

    const [volume, , page] = citation.split(' ');
    const citationObj: CitationObj = {
        href: '',
        page: page,
        year: '',
        volume: volume
    };
    const caseName = await getCaseNameByCitation(citationObj);

    if (!caseName) {
        ctx.unresolvedCitations.add(citation);
        return;
    }

    const caseItem = await prisma.supreme_court_cases.findFirst({
        where: {
            AND: [
                {
                    citation: {
                        path: ['volume'],
                        equals: citationObj.volume
                    }
                },
                {
                    citation: {
                        path: ['page'],
                        equals: citationObj.page
                    }
                }
            ]
        }
    });

    if (caseItem) {
        await processCase(caseItem, ctx);
    }
}

async function saveUnresolvedCitations(unresolvedCitations: Set<string>) {
    const filePath = path.join(__dirname, 'unresolved_citations.json');
    await fs.writeFile(filePath, JSON.stringify(Array.from(unresolvedCitations), null, 2));
    console.log(`Unresolved citations saved to ${filePath}`);
}

export {
    fetchPage,
    extractTextAndGoogleScholarLink,
    extractCitations,
    extractOwnCitation,
    getGoogleScholarCaseLink,
    getCaseNameByCitation,
    processCase,
    processCitationsRecursively,
    saveUnresolvedCitations,
    Context,
    CitationObj
};
