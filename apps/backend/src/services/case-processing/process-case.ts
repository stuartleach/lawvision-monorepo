// process-case.ts
import { Context } from './context';
import { fetchPage } from './fetch-page';
import { extractTextAndGoogleScholarLink } from './extract';
import { extractCitations, extractOwnCitation, getGoogleScholarCaseLink, getCaseDetailsByCitation, createCaseCitation, CitationObj } from './citation';
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
            const caseDetails = await getCaseDetailsByCitation(citation);
            if (!caseDetails.name) {
                ctx.unresolvedCitations.add(citation);
                return null;
            }
            return {
                citation: citation,
                caseDetails: caseDetails,
                googleScholarLink: updatedGoogleScholarLink.link
            };
        })
    );

    for (const detail of citationDetails) {
        if (detail) {
            console.log(`${caseItem.name} cites ${detail.citation} - ${detail.caseDetails.name}\nGoogle Scholar Link: ${detail.googleScholarLink}\n`);
            const [volume, , page] = detail.citation.split(' ');
            const citationObj: CitationObj = {
                href: '',
                page: page,
                year: '', // Populate this as needed
                volume: volume
            };
            await createCaseCitation(caseItem.id, citationObj, detail.caseDetails);
            const newContext = { ...ctx, currentDepth: ctx.currentDepth + 1 };
            await processCitationsRecursively(citationObj, newContext);
        }
    }
}

export async function processCitationsRecursively(citation: CitationObj, ctx: Context) {
    if (ctx.currentDepth > ctx.recursionLimit) {
        console.debug('Recursion limit reached');
        return;
    }

    const caseDetails = await getCaseDetailsByCitation(`${citation.volume} U.S. ${citation.page}`);

    if (!caseDetails.name) {
        ctx.unresolvedCitations.add(`${citation.volume} U.S. ${citation.page}`);
        return;
    }

    const caseItem = await prisma.supreme_court_cases.findFirst({
        where: {
            citation_id: `${citation.volume} U.S. ${citation.page}`
        }
    });

    if (caseItem) {
        await processCase(caseItem, ctx);
    }
}
