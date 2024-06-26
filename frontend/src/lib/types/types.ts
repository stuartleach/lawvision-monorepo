import type { Feature } from 'geojson';

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


