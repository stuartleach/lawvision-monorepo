export interface County {
	name: string;
	countyUUID: string;
	medianIncome: number;
	stats: CaseStats;
}

type Coordinates = number[][][][];

interface MultiPolygon {
	type: 'MultiPolygon';
	coordinates: Coordinates;
}

interface FeatureProperties {
	geoid: string;
	name: string;
}

export interface GeoJSONFeature {
	geometry: MultiPolygon;
	type: 'Feature';
	properties: FeatureProperties;
}

export type GeoJSONData = {
	type: string;
	features: GeoJSONFeature[];
};

export interface CountyWithGeoJSON {
	county: County;
	geoJsonFeature: GeoJSONFeature;
}

export interface MinMax {
	bailSet: [number, number];
	bailAmount: [number, number];
	remand: [number, number];
	ror: [number, number];
	nmr: [number, number];
	unknown: [number, number];
	release: [number, number];
}

export interface Judge {
	judgeUUID: string;
	name: string;
	stats: CaseStats;
	counties?: string[];
}

export type JudgeOrCounty = {
	stats: CaseStats
}

export interface CaseStats {
	averageBailSet: number;
	totalBailSet: number;
	caseCount: number;
	raw: {
		ror: number;
		remand: number;
		bailSet: number;
		unknown: number;
		nmr: number;
		release: number;
	};
	pct: {
		ror: number;
		nmr: number;
		remand: number;
		bailSet: number;
		unknown: number;
		release: number;
	};
}

export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export type JudgeQuery = {
	fetch: FetchFunction;
	countyId: string;
	limit: number;
}

export type JudgeOutcomesQuery = {
	fetch: FetchFunction;
	judgeId: string;
}

export type CombinedPreTrialOutcomes = {
	[chargeWeight: string]: RaceOutcomesMap
};

export type ChargeSeverityOutcomesMap = {
	'AF': PretrialOutcomes;
	'BF': PretrialOutcomes;
	'CF': PretrialOutcomes;
	'DF': PretrialOutcomes;
	'EF': PretrialOutcomes;
	'AM': PretrialOutcomes;
	'BM': PretrialOutcomes;
	'I': PretrialOutcomes;
	'UM': PretrialOutcomes;
	'unknown': PretrialOutcomes;
}


export type RaceOutcomesMap = {
	'White': PretrialOutcomes;
	'Black': PretrialOutcomes;
	'American Indian/Alaska Native': PretrialOutcomes;
	'Asian/Pacific Islander': PretrialOutcomes;
	'Other': PretrialOutcomes;
	'Unknown': PretrialOutcomes;
}

export type JudgeOutcomes = {
	charges: ChargeSeverityOutcomesMap;
	races: RaceOutcomesMap;
}

export type PretrialOutcomeTypes = {
	'bail': number;
	'release': number;
	'unknown': number;
	'remand': number;
}

export type PretrialOutcomes = {
	raw: PretrialOutcomeTypes;
	pct: PretrialOutcomeTypes;
}

export type CountyQuery = {
	fetch: FetchFunction;
}

export type GeoJSONQuery = {
	fetch: FetchFunction
}
