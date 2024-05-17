// context.ts
export interface Context {
    tooManyRequests: boolean;
    currentDepth: number;
    recursionLimit: number;
    unresolvedCitations: Set<string>;
    requestDelay: number; // Delay in milliseconds between requests
}

export const context: Context = {
    tooManyRequests: true,
    currentDepth: 0,
    recursionLimit: 5,  // Adjust this value for your desired recursion limit
    unresolvedCitations: new Set<string>(),
    requestDelay: 2000 // 2 seconds delay between requests
};
