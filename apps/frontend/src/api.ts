import { SupremeCourtCase } from '@shared/types';


// check if shared was imported correctly
// check if the types are correct
console.log(SupremeCourtCase);

const getCases = async (numCases: number): Promise<SupremeCourtCase[]> => {
    const response = await fetch(`/random-case?numCases=${numCases}`);
    return response.json();
};

export { getCases };
