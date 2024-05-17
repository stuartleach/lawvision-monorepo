import * as cheerio from "cheerio";
import { ExtractionResult, CitationObj } from "./context";

export function extractTextAndGoogleScholarLink(html: string): ExtractionResult {
    const $ = cheerio.load(html);
    const text = $('.-display-inline-block.text-left').text();
    const googleScholarLink = $('a:contains("Google Scholar")').attr('href') || '';
    return { text, googleScholarLink };
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
