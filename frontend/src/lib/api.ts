import type { CaseStats, County, GeoJSONData, Judge } from '$lib/types';
import type { CountyModel, JudgeModel } from '$lib/types';
import { mutateCounty, mutateJudge } from '$lib/utils';
import { allCountiesStore, countyJudgesStore } from '$lib/stores/data';

// Generic fetch function to reduce redundancy
const fetchData = async <T>(fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, url: string, options?: RequestInit): Promise<T> => {
	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		},
		method: 'GET',
		...options
	});

	if (!response.ok) {
		throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
	}

	return response.json();
};

// Fetch all counties with specific mutation function
const getAllCounties = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>): Promise<County[]> => {
	const allCounties: CountyModel[] = await fetchData<CountyModel[]>(fetch, `/api/counties?limit=10000`);
	return allCounties.map(mutateCounty);
};

// Fetch geographic JSON data
const getGeoJson = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>): Promise<GeoJSONData> => {
	return fetchData<GeoJSONData>(fetch, '/ny-counties.json');
};

// Fetch judges by county with limit
const getJudgesByCounty = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, county: string, limit: number): Promise<Judge[]> => {
	const allJudges: JudgeModel[] = await fetchData<JudgeModel[]>(fetch, `/api/judges?county=${county}&limit=${limit}`);
	return allJudges.map(mutateJudge);
};

// Fetch all judges with limit
const getAllJudges = async (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, limit: number): Promise<Judge[]> => {
	const allJudges: JudgeModel[] = await fetchData<JudgeModel[]>(fetch, `/api/judges?limit=${limit}`);
	return allJudges.map(mutateJudge);
};

const fetchTopJudges = async (countyName: string) => {
	if (countyName) {
		try {
			const judges = await getJudgesByCounty(fetch, countyName, 20);
			countyJudgesStore.set(judges);
		} catch (error) {
			console.error('Error fetching judges:', error);
		}
	} else {
		countyJudgesStore.set([]);
	}
};

export { getAllCounties, getJudgesByCounty, getAllJudges, getGeoJson, fetchTopJudges };
