import type {
	County,
	CountyQuery,
	FetchFunction,
	GeoJSONData,
	GeoJSONQuery,
	Judge,
	JudgeQuery, NewYorkState, NewYorkStateQuery
} from '$lib/types';

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
	return fetchData<GeoJSONData>(fetch, '/ny_counties_geojson.json');
};

const getJudges = async (query: JudgeQuery): Promise<Judge[]> => {
	const { fetch } = query;
	let url = `/judges.json`;
	const params: string[] = [];
	if (params.length) {
		url += `?${params.join('&')}`;
	}
	let judges: Judge[] = await fetchData<Judge[]>(fetch, url);
	judges = judges.filter(
		(judge) =>
			judge.name !== 'Judge/JHO/Hearing Examiner, Visiting' &&
			judge.name !== 'Office, Clerk\'s'
	);
	return judges;
};

const getCounties = async (query: CountyQuery): Promise<County[]> => {
	const { fetch } = query;
	const url = '/counties.json';
	return await fetchData<County[]>(fetch, url);
};

const getNewYorkState = async (query: NewYorkStateQuery): Promise<NewYorkState> => {
	const { fetch } = query;
	const url = '/state.json';
	return await fetchData<NewYorkState>(fetch, url);

};

export { getGeoJson, getCounties, getJudges, getNewYorkState };
