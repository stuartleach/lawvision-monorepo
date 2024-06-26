import type { CaseStats } from '$lib/types/types';

export type CountyModel = {
	county_uuid: string;
	county_name: string;
	average_bail_set?: number;
	case_count?: number;
	median_income?: number;
	median_id?: string;
	cases_bail_set?: number;
	cases_remand?: number;
	cases_ror?: number;
	cases_unknown?: number;
	cases_nmr?: number;
}

export type JudgeModel = {
	judge_name: string;
	judge_uuid: string;
	average_bail_set?: number;
	unique_districts: string[];
	case_count?: number;
	counties: string[];
	court_names: string[];
	disposition_types: string[];
	remand_to_jail_count?: number;
	ror_count?: number;
	bail_set_and_posted_count?: number;
	bail_set_and_not_posted_count?: number;
	supervision_conditions: string[];
	average_sentence_severity?: number;
	rearrest_rate?: number;
	cases_bail_set?: number;
	cases_remand?: number;
	cases_ror?: number;
	cases_unknown?: number;
	cases_nmr?: number;
}

export type JudgeModelOrCountyModel = {
	average_bail_set?: number;
	case_count?: number;
	cases_bail_set?: number;
	cases_remand?: number;
	cases_ror?: number;
	cases_unknown?: number;
	cases_nmr?: number;
}


export type CaseModel = {
	internal_case_id: string;
	gender?: string;
	ethnicity?: string;
	age_at_crime?: number;
	age_at_arrest?: number;
	offense_month?: string;
	offense_year?: string;
	arrest_month?: string;
	arrest_year?: string;
	arrest_type?: string;
	top_arrest_law?: string;
	top_arrest_article_section?: string;
	top_arrest_attempt_indicator?: string;
	top_charge_severity_at_arrest?: string;
	top_charge_weight_at_arrest?: string;
	top_charge_at_arrest_violent_felony_ind?: string;
	case_type?: string;
	first_arraign_date?: string;
	top_arraign_law?: string;
	top_arraign_article_section?: string;
	top_arraign_attempt_indicator?: string;
	top_charge_at_arraign?: string;
	top_severity_at_arraign?: string;
	top_charge_weight_at_arraign?: string;
	top_charge_at_arraign_violent_felony_ind?: string;
	arraign_charge_category?: string;
	app_count_arraign_to_dispo_released?: string;
	app_count_arraign_to_dispo_detained?: string;
	app_count_arraign_to_dispo_total?: string;
	def_attended_sched_pretrials?: string;
	remanded_to_jail_at_arraign?: string;
	ror_at_arraign?: string;
	bail_set_and_posted_at_arraign?: string;
	bail_set_and_not_posted_at_arraign?: string;
	nmr_at_arraign?: string;
	release_decision_at_arraign?: string;
	representation_at_securing_order?: string;
	pretrial_supervision_at_arraign?: string;
	contact_pretrial_service_agency?: string;
	electronic_monitoring?: string;
	travel_restrictions?: string;
	passport_surrender?: string;
	no_firearms_or_weapons?: string;
	maintain_employment?: string;
	maintain_housing?: string;
	maintain_school?: string;
	placement_in_mandatory_program?: string;
	removal_to_hospital?: string;
	obey_order_of_protection?: string;
	obey_court_conditions_family_offense?: string;
	other_nmr?: string;
	order_of_protection?: string;
	first_bail_set_cash?: string;
	first_bail_set_credit?: string;
	first_insurance_company_bail_bond?: string;
	first_secured_surety_bond?: string;
	first_secured_app_bond?: string;
	first_unsecured_surety_bond?: string;
	first_unsecured_app_bond?: string;
	first_partially_secured_surety_bond?: string;
	partially_secured_surety_bond_perc?: string;
	first_partially_secured_app_bond?: string;
	partially_secured_app_bond_perc?: string;
	bail_made_indicator?: string;
	warrant_ordered_btw_arraign_and_dispo?: string;
	dat_wo_ws_prior_to_arraign?: string;
	first_bench_warrant_date?: string;
	non_stayed_wo?: string;
	num_of_stayed_wo?: string;
	num_of_row?: string;
	docket_status?: string;
	disposition_type?: string;
	disposition_detail?: string;
	dismissal_reason?: string;
	disposition_date?: string;
	most_severe_sentence?: string;
	top_conviction_law?: string;
	top_conviction_article_section?: string;
	top_conviction_attempt_indicator?: string;
	top_charge_at_conviction?: string;
	top_charge_severity_at_conviction?: string;
	top_charge_weight_at_conviction?: string;
	top_charge_at_conviction_violent_felony_ind?: string;
	days_arraign_remand_first_released?: string;
	known_days_in_custody?: string;
	days_arraign_bail_set_to_first_posted?: string;
	days_arraign_bail_set_to_first_release?: string;
	days_arraign_to_dispo?: string;
	ucmslivedate?: string;
	prior_vfo_cnt?: string;
	prior_nonvfo_cnt?: string;
	prior_misd_cnt?: string;
	pend_vfo?: string;
	pend_nonvfo?: string;
	pend_misd?: string;
	supervision?: string;
	rearrest?: string;
	rearrest_date?: string;
	rearrest_firearm?: string;
	rearrest_date_firearm?: string;
	arr_cycle_id?: string;
	race_id?: string;
	court_id?: string;
	county_id?: string;
	top_charge_id?: string;
	representation_id?: string;
	judge_id?: string;
	case_uuid: string;
	district_id?: string;
	counties?: CountyModel;
	courts?: CourtModel;
	districts?: DistrictModel;
	judges?: JudgeModel;
	races?: RaceModel;
	representation?: RepresentationModel;
	crimes?: CrimeModel;
}
export type CourtModel = {
	court_uuid: string;
	court_name: string;
	court_ori?: string;
	district?: string;
	region?: string;
	court_type?: string;
	average_bail_amount?: number;
	number_of_cases?: number;
}

export type CrimeModel = {
	crime_uuid: string;
	top_charge_at_arrest: string;
	average_bail_amount?: number;
	number_of_cases?: number;
}

export type DistrictModel = {
	district_uuid: string;
	district_name: string;
	region?: string;
	county_id?: string;
}

export type RaceModel = {
	race_uuid: string;
	race: string;
	average_bail_amount?: number;
	number_of_cases?: number;
	average_known_days_in_custody?: number;
	remanded_percentage?: number;
	bail_set_percentage?: number;
	disposed_at_arraign_percentage?: number;
	ror_percentage?: number;
	nonmonetary_release_percentage?: number;
}

export type RepresentationModel = {
	representation_uuid: string;
	representation_type: string;
	average_bail_amount?: number;
	number_of_cases?: number;
	average_known_days_in_custody?: number;
	remanded_percentage?: number;
	bail_set_percentage?: number;
	disposed_at_arraign_percentage?: number;
	ror_percentage?: number;
	nonmonetary_release_percentage?: number;
}
