import axios from 'axios';
import * as cheerio from 'cheerio';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// --- Data Fetching ---

async function fetchPage(url: string): Promise<{ data: string, status: number }> {
    const response = await axios.get(url);

    return {data: response.data, status: response.status};
}

// --- Text Extraction & Parsing ---

function extractTextAndGoogleScholarLink(html: string) {
    const $ = cheerio.load(html);

    const text = $('.-display-inline-block.text-left').text();

    let googleScholarLink = '';
    $('a').each((_, elem) => {
        if ($(elem).text() === 'Google Scholar') {
            googleScholarLink = $(elem).attr('href') ?? googleScholarLink;
            return false; // Stop iteration once found
        }
    });

    return {text, googleScholarLink};
}


type Context = {
    tooManyRequests: boolean
}

const context = {
    tooManyRequests: false
}


async function getGoogleScholarCaseLink(link: string, ctx: Context) {
    if (!link || ctx.tooManyRequests) return link;
    try {
        const response = await fetchPage(link);
        if (response.status === 429) {
            if (!ctx.tooManyRequests) {
                console.error("Too many requests to Google Scholar. Skipping remaining cases...");
                ctx.tooManyRequests = true;
            }
            return link;
        }
        const $ = cheerio.load(response.data);
        return "https://scholar.google.com" + $('.gs_rt > a').first().attr('href') ?? link;
    } catch (error: any) {
        console.error("Error fetching Google Scholar link:", error.message);
        if (error.response?.status === 429) {

                ctx.tooManyRequests = true;

        }
        return link;
    }
}

function extractCitations(text: string): string[] {
    const citationRegex = /([0-9]+)\s+U\.?\s*S\.?\s*([0-9]+)/g;
    const matches = Array.from(text.matchAll(citationRegex));
    return Array.from(new Set(matches.map(match => `${match[1]} U.S. ${match[2]}`))); // Unique citations
}

// --- Main Logic ---

async function run(ctx: Context) {
    const listOfCases = await prisma.supreme_court_cases.findMany({take: 2});

    for (const caseItem of listOfCases) {
        try {
            if (!caseItem.justia_url) {
                console.error("No URL found for case:", caseItem);
                continue; // Skip to the next case
            }

            const res = await fetchPage(caseItem.justia_url);
            const {text, googleScholarLink} = extractTextAndGoogleScholarLink(res.data);
            const updatedGoogleScholarLink = await getGoogleScholarCaseLink(googleScholarLink, ctx);

            const thisCitation = extractOwnCitation(caseItem.citation as CitationObj);

            const citations = extractCitations(text);

            citations.sort((a, b) => {
                const aNum = parseInt(a.split(' ')[0]);
                const bNum = parseInt(b.split(' ')[0]);
                return aNum - bNum;
            })

            // if thisCitation is in citations, remove it
            const index = citations.indexOf(thisCitation);
            if (index !== -1) {
                citations.splice(index, 1);
            }

            console.log(
                `${caseItem.name}\nContains the following citations:\n\n${citations.join(', ')}\n${updatedGoogleScholarLink}\nCitation: ${thisCitation ?? "N/A"}\n\n`
            )


            // ... your logic to add citations to the database (addCitationsToCase)
        } catch (error) {
            console.error("Error processing case:", caseItem, error);
        }
    }
}

run(context)
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });


// extract citations from text

// extract own citation from case

type CitationObj = {
    "href": string,
    "page": string,
    "year": string,
    "volume": string,
}


function extractOwnCitation(citationObj: CitationObj): string {

    // const citationObj: CitationObj = JSON.parse(citationJson); // Parse the JSON string
    if (citationObj && citationObj.volume && citationObj.page) {
        return `${citationObj.volume} U.S. ${citationObj.page}`;
    }
    return "NOT FOUND";
}


/*
export const extractSupremeCourtCitations = (text: string | null): string[] => {
    if (!text) {
        return [];
    }
    const citationRegex = /([0-9]+)\s+U\.?\s*S\.?\s*([0-9]+)/g; // Match patterns like "543 U.S. 125"
    const matches = text.matchAll(citationRegex);

    const citations: string[] = [];
    for (const match of matches) {
        citations.push(`${match[1]} U.S. ${match[2]}`); // Standardize format
    }

    return citations;
}*/
