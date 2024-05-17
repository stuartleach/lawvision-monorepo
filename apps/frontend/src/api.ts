import type { supreme_court_cases as SupremeCourtCase } from '@shared/prisma';

interface Node {
    id: string;
    name: string;
    term: string;
}

interface Edge {
    source: string;
    target: string | null;
    citation: string;
}

interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

const getCases = async (numCases: number): Promise<GraphData> => {
    console.log("numCases: ", numCases)
    const response = await fetch(`/api/cases?numCases=${numCases}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
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
