import {GraphData} from './types/types'

const getCases = async (numCases: number): Promise<GraphData> => {
    // console.log("numCases: ", numCases);
    const response = await fetch(`/api/cases?numCases=${numCases}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
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

export {getCases, runServerUtils};
