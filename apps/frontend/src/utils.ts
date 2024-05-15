import {faker} from '@faker-js/faker';

export type CourtCase = {
    firstParty: string;
    secondParty: string;
    title: string;
    caseCitation: string;
    court: string;
    year: number;
    childCases: string[];
    citations: string[];
};

// generate court cases
export const generateCourtCases = (numCases: number): CourtCase[] => {
    const cases: CourtCase[] = [];
    for (let i = 0; i < numCases; i++) {
        const caseYear = faker.date.past({years: 100}).getFullYear();
        const firstParty = faker.company.name();
        const secondParty = faker.person.fullName();
        const newCase: CourtCase = {
            firstParty,
            secondParty,
            title: `${firstParty} vs. ${secondParty} (${caseYear})`,
            caseCitation: `${faker.number.int({min: 100, max: 999})} U.S. ${faker.number.int({min: 1, max: 999})} (${caseYear})`,
            court: "Supreme Court of the United States",
            year: caseYear,
            childCases: [],
            citations: [],
        };
        cases.push(newCase);
    }

    cases.sort((a, b) => a.year - b.year);

    // Ensure every case except the last is cited by at least one following case
    for (let i = 0; i < cases.length - 1; i++) {
        let hasCitation = false;

        // Assign a random number of citations
        const numberOfCitations = weightedRandomCitationCount();
        for (let j = 1; j <= numberOfCitations && i + j < cases.length; j++) {
            if (cases[i].year <= cases[i + j].year) {
                cases[i].citations.push(cases[i + j].caseCitation);
                cases[i + j].childCases.push(cases[i].caseCitation);
                hasCitation = true;
            }
        }

        // Ensure at least one citation if none has been made
        if (!hasCitation) {
            cases[i].citations.push(cases[i + 1].caseCitation);
            cases[i + 1].childCases.push(cases[i].caseCitation);
        }
    }

    return cases;
};

// Helper function to generate a weighted random count of citations
function weightedRandomCitationCount(): number {
    const weights = [3, 1, 1, 1, 1, 1, 1 ]; // Weights for 0 to 8 citations
    const sum = weights.reduce((acc, el) => acc + el, 0);
    let rand = Math.random() * sum;

    for (let i = 0; i < weights.length; i++) {
        if (rand < weights[i]) {
            return i;
        }
        rand -= weights[i];
    }
    return 2; // Default return value (safeguard)
}

// extract citations from text
export const extractSupremeCourtCitations =(text: string): string[] => {
    const citationRegex = /([0-9]+)\s+U\.?\s*S\.?\s*([0-9]+)/g; // Match patterns like "543 U.S. 125"
    const matches = text.matchAll(citationRegex);

    const citations: string[] = [];
    for (const match of matches) {
        citations.push(`${match[1]} U.S. ${match[2]}`); // Standardize format
    }

    return citations;
}