import {
    fetchPage,
    sleep
} from './fetch-utils';
import {
    extractTextAndGoogleScholarLink,
    extractCitations,
    extractOwnCitation
} from './extraction-utils';
import {
    getGoogleScholarCaseLink,
    getCaseNameByCitation
} from './citation-utils';
import {
    Context,
    CitationObj
} from './context';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function processCase(caseItem: any, ctx: Context) {
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
            const newContext = { ...ctx, currentDepth: ctx.currentDepth + 1 };
            await processCitationsRecursively(detail.citation, newContext);
        }
    }
}

export async function processCitationsRecursively(citation: string, ctx: Context) {
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

export async function saveUnresolvedCitations(unresolvedCitations: Set<string>) {
    const filePath = path.join(__dirname, 'unresolved_citations.json');
    await fs.writeFile(filePath, JSON.stringify(Array.from(unresolvedCitations), null, 2));
    console.log(`Unresolved citations saved to ${filePath}`);
}
