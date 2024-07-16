export interface County {
	county_id: string;
	name: string;
	arraignmentResults: ResultsBySeverity;
}

export interface Judge {
	judgeId: string;
	name: string;
	primaryCounty: string;
	arraignmentResults: ResultsBySeverity;
}

export interface BailSet {
	raw: number;
	percent: number;
}

export interface ArraignmentResults {
	bailSet: {
		raw: number;
		percent: number;
		amount: number;
	};
	remanded: BailSet;
	released: BailSet;
	totalCases: number;
}


export type Race =
	'Any'
	| 'White'
	| 'Black'
	| 'American Indian/Alaskan Native'
	| 'Asian/Pacific Islander'
	| 'Other'
	| 'Unknown';

export type SeverityLevel =
	'Any'
	| 'AF'
	| 'BF'
	| 'CF'
	| 'DF'
	| 'EF'
	| 'AM'
	| 'BM'
	| 'I'
	| 'V'
	| 'UM'


export type ArraignmentResultsByRace = {
	[race in Race]: ArraignmentResults;
};

export type ResultsBySeverity = {
	[severity in SeverityLevel]: ArraignmentResultsByRace;
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


export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export type JudgeQuery = {
	fetch: FetchFunction;
	// countyId: string;
	// limit: number;
};

export type JudgeDetailsQuery = {
	fetch: FetchFunction;
	judgeId: string;
}

export type JudgeOutcomesQuery = {
	fetch: FetchFunction;
	judgeId: string;
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


export type CountyQuery = {
	fetch: FetchFunction;
};

export type GeoJSONQuery = {
	fetch: FetchFunction;
};
