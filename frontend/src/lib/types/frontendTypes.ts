export interface County {
	county_id: string;
	name: string;
	resultsBySeverity: ResultsBySeverity;
	allCaseResults: AllCaseResults;
}

export interface Judge {
	judgeId: string;
	name: string;
	primaryCounty: string;
	resultsBySeverity: ResultsBySeverity;
	allCaseResults: AllCaseResults;
}

export interface BailSet {
	raw: number;
	percent: number;
}

export interface ArraignmentResults {
	averageBailAmount: number;
	bailSet: BailSet;
	remanded: BailSet;
	released: BailSet;
	totalCases: number;
}


export type Race = 'White' | 'Black' | 'American Indian/Alaska Native' | 'Asian/Pacific Islander' | 'Other' | 'Unknown';
export type SeverityLevel = 'AF' | 'BF' | 'CF' | 'DF' | 'EF' | 'AM' | 'BM'

export type ArraignmentResultsByRace = {
	[race in Race]: ArraignmentResults;
};


export interface SeverityResult {
	byRace: ArraignmentResultsByRace;
	total: ArraignmentResults;
}

export type ResultsBySeverity = {
	[severity in SeverityLevel]: SeverityResult;
}

interface AllCaseResults {
	byRace: ArraignmentResultsByRace;
	total: ArraignmentResults;
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
