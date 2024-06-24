import type { Feature } from 'geojson';

export interface CountyProperties {
	name: string;
	county_name: string;
	countyUuid: string;
	number_of_cases: number;
	median_income: number;
	average_bail_set: number;
	geoid: string;
	cases_ror: number;
	cases_remand: number;
	cases_bail_set: number;
	cases_unknown: number;
	cases_nmr: number;
}

export interface JudgeProperties {
	judge_uuid: string;
	judge_name: string;
	average_bail_set: number;
	case_count: number;
	cases_ror: number;
	cases_remand: number;
	cases_bail_set: number;
	cases_unknown: number;
	cases_nmr: number;
}

export interface JudgeExpandedProperties extends JudgeProperties {
	judgeProps: JudgeProperties;
	cases_remand_pct: number;
	cases_ror_pct: number;
	cases_bail_set_pct: number;
	cases_unknown_pct: number;
	cases_nmr_pct: number;
}

export interface CountyExpandedProperties extends CountyProperties {
	countyProps: CountyProperties;
	cases_remand_pct: number;
	cases_ror_pct: number;
	cases_bail_set_pct: number;
	cases_unknown_pct: number;
	cases_nmr_pct: number;
}

export interface CountyFeature extends Feature {
	properties: CountyExpandedProperties;
}

export type CountyJsonData = {
	type: string;
	features: CountyFeature[];
};

type Judge = {
	judge_name: string;
	average_bail_set: number;
	case_count: number;
};
