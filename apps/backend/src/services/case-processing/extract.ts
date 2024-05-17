// extract.ts
import * as cheerio from "cheerio";

export interface ExtractionResult {
    text: string;
    googleScholarLink: string;
}

export function extractTextAndGoogleScholarLink(html: string): ExtractionResult {
    const $ = cheerio.load(html);
    const text = $('.-display-inline-block.text-left').text();
    const googleScholarLink = $('a:contains("Google Scholar")').attr('href') || '';
    return { text, googleScholarLink };
}
