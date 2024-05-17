import { PrismaClient } from '@prisma/client';
import { Context, CitationObj } from "./context";
import {fetchPage} from "./fetch-utils";
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

export async function getGoogleScholarCaseLink(link: string, ctx: Context): Promise<{ link: string; ctx: Context }> {
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

export async function getCaseNameByCitation(citation: CitationObj): Promise<string | null> {
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
