// @ts-ignore
import type {supreme_court_cases as SupremeCourtCase} from '@shared/prisma';


// check if shared was imported correctly
// check if the types are correct

const getCases = async (numCases: number): Promise<SupremeCourtCase[]> => {

    console.log("numCases: ", numCases)
    const response = await fetch(`/api/cases?numCases=${numCases}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    return response.json();
};

export {getCases};
