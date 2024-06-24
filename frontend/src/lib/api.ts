import type { CountyProperties, JudgeExpandedProperties } from '$lib/types';

const getCounties = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>): Promise<CountyProperties[]> => {
	const response = await fetch(`/api/counties`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error(`Error fetching counties: ${response.statusText}`);
	}

	return await response.json();
};

const getJudgesByCounty = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, county: string, limit: number): Promise<JudgeExpandedProperties[]> => {
	const response = await fetch(`/api/top_judges_by_county?county=${county}&limit=${limit}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error(`Error fetching judges: ${response.statusText}`);
	}

	const judges = await response.json();

	for (let judge in judges) {
		judges[judge].cases_remand_pct = judges[judge].cases_remand / judges[judge].case_count;
		judges[judge].cases_ror_pct = judges[judge].cases_ror / judges[judge].case_count;
		judges[judge].cases_bail_set_pct = judges[judge].cases_bail_set / judges[judge].case_count;
		judges[judge].cases_unknown_pct = judges[judge].cases_unknown / judges[judge].case_count;
		judges[judge].cases_nmr_pct = judges[judge].cases_nmr / judges[judge].case_count;
	}

	return judges;
	// return await response.json();
};

const getAllJudges = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, limit: number): Promise<JudgeExpandedProperties[]> => {
	const response = await fetch(`/api/top_judges?limit=${limit}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error(`Error fetching judges: ${response.statusText}`);
	}

	const allJudges = await response.json();

	for (let judge in allJudges) {
		allJudges[judge].cases_remand_pct = allJudges[judge].cases_remand / allJudges[judge].case_count;
		allJudges[judge].cases_ror_pct = allJudges[judge].cases_ror / allJudges[judge].case_count;
		allJudges[judge].cases_bail_set_pct = allJudges[judge].cases_bail_set / allJudges[judge].case_count;
		allJudges[judge].cases_unknown_pct = allJudges[judge].cases_unknown / allJudges[judge].case_count;
		allJudges[judge].cases_nmr_pct = allJudges[judge].cases_nmr / allJudges[judge].case_count;
	}

	return allJudges;

};

export { getCounties, getJudgesByCounty, getAllJudges };
