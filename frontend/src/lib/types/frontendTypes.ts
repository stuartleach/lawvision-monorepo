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
	primaryCounty: string;
	counties?: string[];
}

export type JudgeOrCounty = {
	stats: CaseStats;
	judgeUUID?: string;
	countyUUID?: string;
	name: string;
};

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
	pctileState: {
		bailAmount: number;
		caseCount: number;
		ror: number;
		remand: number;
		bailSet: number;
		unknown: number;
		nmr: number;
		release: number;
	};
	pctileCounty?: {
		// not present in county stats
		bailAmount: number;
		caseCount: number;
		ror: number;
		remand: number;
		bailSet: number;
		unknown: number;
		nmr: number;
		release: number;
	};
}

export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export type JudgeQuery = {
	fetch: FetchFunction;
	countyId: string;
	limit: number;
};

export type JudgeDetailsQuery = {
	fetch: FetchFunction;
	judgeId: string;
}

export type JudgeOutcomesQuery = {
	fetch: FetchFunction;
	judgeId: string;
};

export type CombinedPreTrialOutcomes = {
	[chargeWeight: string]: RaceOutcomesMap;
};

export type ChargeSeverityOutcomesMap = {
	AF: PretrialOutcomes;
	BF: PretrialOutcomes;
	CF: PretrialOutcomes;
	DF: PretrialOutcomes;
	EF: PretrialOutcomes;
	AM: PretrialOutcomes;
	BM: PretrialOutcomes;
	I: PretrialOutcomes;
	UM: PretrialOutcomes;
	unknown: PretrialOutcomes;
};

// Define the enum without quotes around the keys
export enum SortTarget {
	name = 'Name',
	remandPct = 'Remand Percentage',
	releasePct = 'Release Percentage',
	averageBail = 'Average Bail',
	caseCount = 'Total Cases',
	remandRaw = 'Total Cases Remanded',
	releaseRaw = 'Total Cases Released',
	bailSet = 'Bail Set Frequency'
}

export enum SortOrder {
	asc = 'asc',
	desc = 'desc'
}

export type RaceOutcomesMap = {
	White: PretrialOutcomes;
	Black: PretrialOutcomes;
	'American Indian/Alaska Native': PretrialOutcomes;
	'Asian/Pacific Islander': PretrialOutcomes;
	Other: PretrialOutcomes;
	Unknown: PretrialOutcomes;
};

export type JudgeOutcomes = {
	charges: ChargeSeverityOutcomesMap;
	races: RaceOutcomesMap;
};

export type PretrialOutcomeTypes = {
	bail: number;
	release: number;
	unknown: number;
	remand: number;
};

export type PretrialOutcomes = {
	raw: PretrialOutcomeTypes;
	pct: PretrialOutcomeTypes;
};

export type CountyQuery = {
	fetch: FetchFunction;
};

export type GeoJSONQuery = {
	fetch: FetchFunction;
};
