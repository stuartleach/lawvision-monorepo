import type { Feature } from 'geojson';

export interface CountyProperties {
	name: string;
	county_name: string;
	countyUuid: string;
	number_of_cases: number;
	median_income: number;
	average_bail_amount: number;
	geoid: string;
}

export interface JudgeProperties {
	judge_name: string;
	average_bail_set: number;
	case_count: number;
}

export interface CountyFeature extends Feature {
	properties: CountyProperties;
}

export type CountyJsonData = {
	type: string;
	features: CountyFeature[];
}

type Judge = {
	judge_name: string;
	average_bail_set: number;
	case_count: number;
};
