export interface County {
	county_id: string;
	name: string;
	resultsBySeverity: ResultsBySeverity;
	allCaseResults: AllCaseResults;
}

export interface Judge {
	judgeId: string;
	name: string;
	county_name: string;
	resultsBySeverity: ResultsBySeverity;
	allCaseResults: AllCaseResults;
}

interface BailSet {
	raw: number;
	percent: number;
}

interface ArraignmentResults {
	averageBailAmount: number;
	bailSet: BailSet;
	remanded: BailSet;
	released: BailSet;
	totalCases: number;
}

interface ByRace {
	White: ArraignmentResults;
	Black: ArraignmentResults;
	'American Indian/Alaska Native': ArraignmentResults;
	'Asian/Pacific Islander': ArraignmentResults;
	Other: ArraignmentResults;
	Unknown: ArraignmentResults;
}

export const severityLevels = ['AF', 'BF', 'CF', 'DF', 'EF', 'AM', 'BM'];

interface ResultsBySeverity {
	AF: {
		byRace: ByRace;
		total: ArraignmentResults;
	};
	BF: {
		byRace: ByRace;
		total: ArraignmentResults;
	};
	CF: {
		byRace: ByRace;
		total: ArraignmentResults;
	};
	DF: {
		byRace: ByRace;
		total: ArraignmentResults;
	};
	EF: {
		byRace: ByRace;
		total: ArraignmentResults;
	};
	AM: {
		byRace: ByRace;
		total: ArraignmentResults;
	};
	BM: {
		byRace: ByRace;
		total: ArraignmentResults;
	};
}

interface AllCaseResults {
	byRace: ByRace;
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



export interface County {
	countyId: string;
	name: string;
	resultsBySeverity: ResultsBySeverity;
	allCaseResults: AllCaseResults;
}

interface BailSet {
	raw: number;
	percent: number;
}

interface ArraignmentResults {
	averageBailAmount: number;
	bailSet: BailSet;
	remanded: BailSet;
	released: BailSet;
	totalCases: number;
}

interface ByRace {
	White: ArraignmentResults;
	Black: ArraignmentResults;
	'American Indian/Alaska Native': ArraignmentResults;
	'Asian/Pacific Islander': ArraignmentResults;
	Other: ArraignmentResults;
	Unknown: ArraignmentResults;
}

interface ResultsBySeverity {
	[severity: string]: {
		byRace: ByRace;
		total: ArraignmentResults;
	};
}

interface AllCaseResults {
	byRace: ByRace;
	total: ArraignmentResults;
}

interface CountyResults {
	county_id: string;
	county_name: string;
	resultsBySeverity: ResultsBySeverity;
	allCaseResults: AllCaseResults;
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
