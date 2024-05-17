import type { supreme_court_cases as SupremeCourtCase } from '@shared/prisma';

const getCases = async (numCases: number): Promise<SupremeCourtCase[]> => {
    console.log("numCases: ", numCases)
    const response = await fetch(`/api/cases?numCases=${numCases}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    console.log("API response data: ", data);
    return data;
};


const runServerUtils = async (): Promise<void> => {
    const response = await fetch('/api/run-server-utils', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to run server utils job');
    }
};

export { getCases, runServerUtils };
