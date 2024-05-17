// citation.ts
import axios from "axios";
import * as cheerio from "cheerio";
import {PrismaClient} from '@prisma/client';
import {Context} from './context';
import {fetchPage} from './fetch-page';

const prisma = new PrismaClient();

export interface CitationObj {
    href: string;
    page: string;
    year: string;
    volume: string;
}

export function extractCitations(text: string): string[] {
    const citationRegex = /(\d+)\s+U\.?\s*S\.?\s*(\d+)/g;
    const matches = Array.from(text.matchAll(citationRegex));
    const uniqueCitations = new Set(matches.map(match => `${match[1]} U.S. ${match[2]}`));
    return Array.from(uniqueCitations).sort((a, b) => parseInt(a.split(' ')[0]) - parseInt(b.split(' ')[0]));
}

export function extractOwnCitation(citationObj: CitationObj): string {
    if (citationObj?.volume && citationObj?.page) {
        return `${citationObj.volume} U.S. ${citationObj.page}`;
    }
    return 'NOT FOUND';
}

export async function getGoogleScholarCaseLink(link: string, ctx: Context): Promise<{ link: string; ctx: Context }> {
    if (!link || ctx.tooManyRequests) return {link, ctx};

    const fetchResult = await fetchPage(link, ctx);
    if (!fetchResult) {
        ctx.tooManyRequests = true;
        return {link, ctx};
    }

    const {data, status} = fetchResult;
    if (status === 429) {
        console.debug('Too many requests to Google Scholar. Skipping remaining cases...');
        ctx.tooManyRequests = true;
        return {link, ctx};
    }

    const $ = cheerio.load(data);
    const scholarLink = 'https://scholar.google.com' + ($('.gs_rt > a').first().attr('href') || link);
    return {link: scholarLink, ctx};
}

// citation.ts
export async function getCaseDetailsByCitation(citation: string): Promise<{ id: string | null, name: string | null, term: string | null, href: string | null, citation: CitationObj | null }> {
    const caseResult = await prisma.supreme_court_cases.findFirst({
        where: { citation_id: citation },
        select: {
            id: true,
            name: true,
            term: true,
            href: true,
            citation: true
        }
    });

    const citationObj = caseResult?.citation ? {
        volume: (caseResult.citation as any).volume,
        page: (caseResult.citation as any).page,
        year: (caseResult.citation as any).year,
        href: (caseResult.citation as any).href,
    } : null;

    return {
        id: caseResult?.id || null,
        name: caseResult?.name || null,
        term: caseResult?.term || null,
        href: caseResult?.href || null,
        citation: citationObj
    };
}

export async function createCaseCitation(
    selfId: string,
    citation: CitationObj,
    targetDetails: { id: string | null, name: string | null, term: string | null, href: string | null, citation: CitationObj | null }
) {
    // Fetch self case details
    const selfCaseDetails = await prisma.supreme_court_cases.findUnique({
        where: { id: selfId },
        select: { name: true, citation: true }
    });

    // Create the citation
    await prisma.cases_citations.create({
        data: {
            self_id: selfId,
            self_citation: selfCaseDetails?.citation ? `${(selfCaseDetails.citation as any).volume} U.S. ${(selfCaseDetails.citation as any).page}` : 'NOT FOUND',
            self_name: selfCaseDetails?.name || null,  // Assign the name as string
            year: targetDetails.term ? parseInt(targetDetails.term) : null,
            target_citation: targetDetails.citation ? `${targetDetails.citation.volume} U.S. ${targetDetails.citation.page}` : null,
            target_name: targetDetails.name || null,
            target_uuid: targetDetails.id
        }
    });
}