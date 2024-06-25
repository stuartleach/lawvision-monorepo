import type { Feature } from 'geojson';

export interface County {
	name: string;
	countyUUID: string;
	medianIncome: number;
	stats: CaseStats;
}

export interface CountyFeature extends Feature {
	geoid: string;
	properties: County;
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
		bail: number;
		unknown: number;
		nmr: number;
		release: number;
	};
	pct: {
		ror: number;
		nmr: number;
		remand: number;
		bail: number;
		unknown: number;
		release: number;
	};
}

export type geoJsonData = {
	type: string;
	features: CountyFeature[];
};
