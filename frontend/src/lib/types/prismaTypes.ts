export type CountyModel = {
	percentile_state_case_count: number;
	county_name: string;
	county_id: string;
	case_count?: number;
	median_income?: number;
	remand_at_arraign?: number;
	ror_at_arraign?: number;
	nmr_at_arraign?: number;
	release_at_arraign?: number;
	bail_set_at_arraign?: number;
	total_bail_set?: number;
	average_bail_set?: number;
	percent_ror?: number;
	percent_nmr?: number;
	percent_release?: number;
	percent_remand?: number;
	percent_bail_set?: number;
	unknown_at_arraign?: number;
	percent_unknown?: number;
	judges?: string[];
	percentile_state_bail_amount?: number;
	percentile_state_bail_set?: number;
	percentile_state_remand?: number;
	percentile_state_ror?: number;
	percentile_state_nmr?: number;
	percentile_state_release?: number;
	percentile_state_unknown?: number;
};

export type BailStatisticsModel = {
	'bail_stat_id': string;
	'judge_id': string;
	'total_bail_set': number;
	'average_bail_set': number;
	'severity': string
};

export type ArraignmentStatisticsModel = {
	'stat_id': string;
	'judge_id': string;
	'stat_type': string;
	'severity': string;
	'count': number;
	'percentage': number;
}


export type JudgeModel = {
	primary_county: string;
	judge_name: string;
	judge_id: string;
	case_count?: number;
	remand_at_arraign?: number;
	ror_at_arraign?: number;
	nmr_at_arraign?: number;
	release_at_arraign?: number;
	bail_set_at_arraign?: number;
	total_bail_set?: number;
	average_bail_set?: number;
	percent_ror?: number;
	percent_nmr?: number;
	percent_release?: number;
	percent_remand?: number;
	percent_bail_set?: number;
	unknown_at_arraign?: number;
	percent_unknown?: number;
	counties?: string[];
	percentile_county_bail_amount?: number;
	percentile_county_bail_set?: number;
	percentile_county_remand?: number;
	percentile_county_ror?: number;
	percentile_county_nmr?: number;
	percentile_county_release?: number;
	percentile_county_unknown?: number;
	percentile_state_bail_amount?: number;
	percentile_state_bail_set?: number;
	percentile_state_remand?: number;
	percentile_state_ror?: number;
	percentile_state_nmr?: number;
	percentile_state_release?: number;
	percentile_state_unknown?: number;
	percentile_state_case_count: number;
	percentile_county_case_count: number;
};
