import type { CountyProperties, JudgeProperties } from '$lib/types';

const getCounties = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, endpoint: string): Promise<CountyProperties[]> => {
	const response = await fetch(`/api/${endpoint}`, {
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

const getJudgesByCounty = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, county: string, limit: number): Promise<JudgeProperties[]> => {
	const response = await fetch(`/api/top_judges_by_county?county=${county}&limit=${limit}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	console.log('response', response);

	if (!response.ok) {
		throw new Error(`Error fetching judges: ${response.statusText}`);
	}

	return await response.json();
};

export { getCounties, getJudgesByCounty };
