export interface FetchPageResult {
    data: string;
    status: number;
}

export interface ExtractionResult {
    text: string;
    googleScholarLink: string;
}

export interface Context {
    tooManyRequests: boolean;
    currentDepth: number;
    recursionLimit: number;
    unresolvedCitations: Set<string>;
    requestDelay: number; // Delay in milliseconds between requests
}

export interface CitationObj {
    href: string;
    page: string;
    year: string;
    volume: string;
}
