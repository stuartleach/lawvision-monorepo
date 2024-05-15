import { SupremeCourtCase } from 'shared';

const getCases = async (numCases: number): Promise<SupremeCourtCase[]> => {
    const response = await fetch(`/random-case?numCases=${numCases}`);
    return response.json();
};

export { getCases };
