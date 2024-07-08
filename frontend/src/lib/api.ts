import {
	countyJudgesStore,
	selectedJudgeArraignmentStatisticsStore, selectedJudgeBailStatisticsStore,
	selectedJudgeOutcomesStore
} from '$lib/stores/data';
import type {
	ArraignmentStatisticsModel,
	BailStatisticsModel,
	County,
	CountyModel,
	CountyQuery,
	FetchFunction,
	GeoJSONData,
	GeoJSONQuery,
	Judge, JudgeDetailsQuery,
	JudgeModel,
	JudgeOutcomes,
	JudgeOutcomesQuery,
	JudgeQuery
} from '$lib/types';
import { mutateCounty, mutateJudge } from '$lib/utils';

const fetchData = async <T>(
	fetch: FetchFunction,
	url: string,
	options?: RequestInit
): Promise<T> => {
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

const getGeoJson = async (query: GeoJSONQuery): Promise<GeoJSONData> => {
	const { fetch } = query;
	return fetchData<GeoJSONData>(fetch, '/ny-counties-geojson.json');
};

const getJudges = async (query: JudgeQuery): Promise<Judge[]> => {
	const { fetch, countyId, limit } = query;
	let url = `/api/judges`;
	// let url = `/judges.json`;
	const params: string[] = [];
	if (countyId) {
		params.push(`county=${encodeURIComponent(countyId)}`);
	}
	if (limit !== undefined) {
		params.push(`limit=${encodeURIComponent(limit)}`);
	}
	if (params.length) {
		url += `?${params.join('&')}`;
	}
	let judges: JudgeModel[] = await fetchData<JudgeModel[]>(fetch, url);
	judges = judges.filter(
		(judge) =>
			judge.judge_name !== 'Judge/JHO/Hearing Examiner, Visiting' &&
			judge.judge_name !== "Office, Clerk's"
	);
	return judges.map(mutateJudge);
};



const getJudgeBailStatistics = async (query: JudgeDetailsQuery): Promise<void> => {
	const { fetch, judgeId } = query;

	const result = await fetchData<BailStatisticsModel[]>(fetch, `/api/judges/${judgeId}/bail_statistics`);

	selectedJudgeBailStatisticsStore.set(result);

}

const getJudgeArraignmentStatistics = async (query: JudgeDetailsQuery): Promise<void> => {
	const { fetch, judgeId } = query;

	const result = await fetchData<ArraignmentStatisticsModel[]>(fetch, `/api/judges/${judgeId}/arraignment_statistics`);

	selectedJudgeArraignmentStatisticsStore.set(result);

}

const getJudgeOutcomes = async (query: JudgeOutcomesQuery): Promise<void> => {
	const { fetch, judgeId } = query;

	const result = await fetchData<JudgeOutcomes>(fetch, `/api/judges/${judgeId}/outcomes`);

	selectedJudgeOutcomesStore.set(result);
};

const getCounties = async (query: CountyQuery): Promise<County[]> => {
	const { fetch } = query;

	// let url = '/api/counties';
	const url = '/counties.json';
	const counties: CountyModel[] = await fetchData<CountyModel[]>(fetch, url);
	return counties.map(mutateCounty);
};

const setTopJudges = async (countyName: string) => {
	if (countyName) {
		try {
			const judges = await getJudges({ fetch, countyId: countyName, limit: 20 });
			countyJudgesStore.set(judges);
		} catch (error) {
			console.error('Error fetching judges:', error);
		}
	} else {
		countyJudgesStore.set([]);
	}
};

export { getGeoJson, setTopJudges, getCounties, getJudges, getJudgeOutcomes, getJudgeBailStatistics, getJudgeArraignmentStatistics };
