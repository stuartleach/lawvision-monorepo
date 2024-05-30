enum targetData {
    "cases",
    "judges"
}

const getData = async (endpoint: string, numToFetch: number): Promise<never> => {
    // console.log("numCases: ", numCases);
    const response = await fetch(`/api/${endpoint}?num=${numToFetch}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return await response.json();
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

export {getData, runServerUtils, targetData};
