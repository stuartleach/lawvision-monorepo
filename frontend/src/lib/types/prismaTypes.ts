// // Base models
//
// export interface CaseRaw {
//   internal_case_id?: string;
//   gender?: string;
//   race?: string;
//   ethnicity?: string;
//   age_at_crime?: string;
//   age_at_arrest?: string;
//   court_name?: string;
//   court_ori?: string;
//   county_name?: string;
//   district?: string;
//   region?: string;
//   court_type?: string;
//   judge_name?: string;
//   offense_month?: string;
//   offense_year?: string;
//   arrest_month?: string;
//   arrest_year?: string;
//   arrest_type?: string;
//   top_arrest_law?: string;
//   top_arrest_article_section?: string;
//   top_arrest_attempt_indicator?: string;
//   top_charge_at_arrest?: string;
//   top_charge_severity_at_arrest?: string;
//   top_charge_weight_at_arrest?: string;
//   top_charge_at_arrest_violent_felony_ind?: string;
//   case_type?: string;
//   first_arraign_date?: string;
//   top_arraign_law?: string;
//   top_arraign_article_section?: string;
//   top_arraign_attempt_indicator?: string;
//   top_charge_at_arraign?: string;
//   top_severity_at_arraign?: string;
//   top_charge_weight_at_arraign?: string;
//   top_charge_at_arraign_violent_felony_ind?: string;
//   hate_crime_ind?: string;
//   arraign_charge_category?: string;
//   representation_type?: string;
//   app_count_arraign_to_dispo_released?: string;
//   app_count_arraign_to_dispo_detained?: string;
//   app_count_arraign_to_dispo_total?: string;
//   def_attended_sched_pretrials?: string;
//   remanded_to_jail_at_arraign?: string;
//   ror_at_arraign?: string;
//   bail_set_and_posted_at_arraign?: string;
//   bail_set_and_not_posted_at_arraign?: string;
//   nmr_at_arraign?: string;
//   release_decision_at_arraign?: string;
//   representation_at_securing_order?: string;
//   pretrial_supervision_at_arraign?: string;
//   contact_pretrial_service_agency?: string;
//   electronic_monitoring?: string;
//   travel_restrictions?: string;
//   passport_surrender?: string;
//   no_firearms_or_weapons?: string;
//   maintain_employment?: string;
//   maintain_housing?: string;
//   maintain_school?: string;
//   placement_in_mandatory_program?: string;
//   removal_to_hospital?: string;
//   obey_order_of_protection?: string;
//   obey_court_conditions_family_offense?: string;
//   other_nmr?: string;
//   order_of_protection?: string;
//   first_bail_set_cash?: string;
//   first_bail_set_credit?: string;
//   first_insurance_company_bail_bond?: string;
//   first_secured_surety_bond?: string;
//   first_secured_app_bond?: string;
//   first_unsecured_surety_bond?: string;
//   first_unsecured_app_bond?: string;
//   first_partially_secured_surety_bond?: string;
//   partially_secured_surety_bond_perc?: string;
//   first_partially_secured_app_bond?: string;
//   partially_secured_app_bond_perc?: string;
//   bail_made_indicator?: string;
//   warrant_ordered_btw_arraign_and_dispo?: string;
//   dat_wo_ws_prior_to_arraign?: string;
//   first_bench_warrant_date?: string;
//   non_stayed_wo?: string;
//   num_of_stayed_wo?: number;
//   num_of_row?: number;
//   docket_status?: string;
//   disposition_type?: string;
//   disposition_detail?: string;
//   dismissal_reason?: string;
//   disposition_date?: string;
//   most_severe_sentence?: string;
//   top_conviction_law?: string;
//   top_conviction_article_section?: string;
//   top_conviction_attempt_indicator?: string;
//   top_charge_at_conviction?: string;
//   top_charge_severity_at_conviction?: string;
//   top_charge_weight_at_conviction?: string;
//   top_charge_at_conviction_violent_felony_ind?: string;
//   days_arraign_remand_first_released?: string;
//   known_days_in_custody?: string;
//   days_arraign_bail_set_to_first_posted?: string;
//   days_arraign_bail_set_to_first_release?: string;
//   days_arraign_to_dispo?: string;
//   ucmslivedate?: string;
//   prior_vfo_cnt?: string;
//   prior_nonvfo_cnt?: string;
//   prior_misd_cnt?: string;
//   pend_vfo?: string;
//   pend_nonvfo?: string;
//   pend_misd?: string;
//   supervision?: string;
//   rearrest?: string;
//   rearrest_date?: string;
//   rearrest_firearm?: string;
//   rearrest_date_firearm?: string;
//   arr_cycle_id?: string;
//   case_raw_id: string;
// }
//
// export interface Percentile {
//   percentile_id: string;
//   judge_id: string;
//   percentile_type: string;
//   percentile_value?: number;
//   judge: Judge;
// }
//
// export interface BailStatistics {
//   bail_stat_id: string;
//   judge_id: string;
//   total_bail_set?: number;
//   average_bail_set?: number;
//   median_bail_set?: number;
//   severity?: string;
//   race?: string;
//   judge: Judge;
// }
//
// export interface ArraignmentStatistics {
//   arraignment_stat_id: string;
//   judge_id: string;
//   stat_type: string;
//   severity: string;
//   count?: number;
//   percentage?: number;
//   race?: string;
//   judge: Judge;
// }
//
// // BASE MODELS
//
// export interface Bail {
//   bail_id: string;
//   first_bail_set_cash?: string;
//   first_bail_set_credit?: string;
//   first_insurance_company_bail_bond?: string;
//   first_secured_surety_bond?: string;
//   first_secured_app_bond?: string;
//   first_unsecured_surety_bond?: string;
//   first_unsecured_app_bond?: string;
//   first_partially_secured_surety_bond?: string;
//   partially_secured_surety_bond_perc?: string;
//   first_partially_secured_app_bond?: string;
//   partially_secured_app_bond_perc?: string;
//   bail_made_indicator?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Case {
//   case_id: string;
//   internal_case_id?: string;
//   case_type?: string;
//   court_id?: string;
//   judge_id?: string;
//   county_id?: string;
//   defendant_id?: string;
//   appearance_id?: string;
//   condition_id?: string;
//   bail_id?: string;
//   warrant_id?: string;
//   disposition_id?: string;
//   calculated_days_id?: string;
//   prior_id?: string;
//   arrest_id?: string;
//   Appearance?: Appearance;
//   Bail?: Bail;
//   CalculatedDays?: CalculatedDays;
//   Conditions?: Conditions;
//   County?: County;
//   Court?: Court;
//   Defendant?: Defendant;
//   Disposition?: Disposition;
//   Judge?: Judge;
//   Prior?: Prior;
//   Warrant?: Warrant;
//   Arrest?: Arrest;
//   Conviction?: Conviction;
//   conviction_id?: string;
//   ArraignCharge?: ArraignCharge;
//   arraign_charge_id?: string;
//   ArraignmentOutcome?: ArraignmentOutcome;
//   arraignment_outcome_id?: string;
//   Representation?: Representation;
//   representation_id?: string;
//   Date?: CaseDetails;
//   date_id?: string;
// }
//
// export interface ArraignmentOutcome {
//   arraignment_outcome_id: string;
//   remanded_to_jail_at_arraign?: string;
//   ror_at_arraign?: string;
//   bail_set_and_posted_at_arraign?: string;
//   bail_set_and_not_posted_at_arraign?: string;
//   nmr_at_arraign?: string;
//   release_decision_at_arraign?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Representation {
//   representation_id: string;
//   representation_type?: string;
//   representation_at_securing_order?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Appearance {
//   appearance_id: string;
//   app_count_arraign_to_dispo_released?: string;
//   app_count_arraign_to_dispo_detained?: string;
//   app_count_arraign_to_dispo_total?: string;
//   def_attended_sched_pretrials?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Arrest {
//   arrest_id: string;
//   arrest_type?: string;
//   top_arrest_law?: string;
//   top_arrest_article_section?: string;
//   top_arrest_attempt_indicator?: string;
//   top_charge_at_arrest?: string;
//   top_charge_severity_at_arrest?: string;
//   top_charge_weight_at_arrest?: string;
//   top_charge_at_arrest_violent_felony_ind?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface CaseDetails {
//   date_id: string;
//   internal_case_id: string;
//   rearrest_date?: string;
//   offense_month?: string;
//   offense_year?: string;
//   arrest_month?: string;
//   arrest_year?: string;
//   rearrest_date_firearm?: string;
//   ucmslivedate?: string;
//   arr_cycle_id?: string;
//   disposition_date?: string;
//   first_bench_warrant_date?: string;
//   first_arraign_date?: string;
//   cases: Case[];
// }
//
// export interface ArraignCharge {
//   arraign_charge_id: string;
//   case_type?: string;
//   top_arraign_law?: string;
//   top_arraign_article_section?: string;
//   top_arraign_attempt_indicator?: string;
//   top_charge_at_arraign?: string;
//   top_severity_at_arraign?: string;
//   top_charge_weight_at_arraign?: string;
//   top_charge_at_arraign_violent_felony_ind?: string;
//   hate_crime_ind?: string;
//   arraign_charge_category?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface CalculatedDays {
//   calculated_days_id: string;
//   days_arraign_remand_first_released?: string;
//   known_days_in_custody?: string;
//   days_arraign_bail_set_to_first_posted?: string;
//   days_arraign_bail_set_to_first_release?: string;
//   days_arraign_to_dispo?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Conditions {
//   condition_id: string;
//   pretrial_supervision_at_arraign?: string;
//   contact_pretrial_service_agency?: string;
//   electronic_monitoring?: string;
//   travel_restrictions?: string;
//   passport_surrender?: string;
//   no_firearms_or_weapons?: string;
//   maintain_employment?: string;
//   maintain_housing?: string;
//   maintain_school?: string;
//   placement_in_mandatory_program?: string;
//   removal_to_hospital?: string;
//   obey_order_of_protection?: string;
//   obey_court_conditions_family_offense?: string;
//   other_nmr?: string;
//   order_of_protection?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Conviction {
//   conviction_id: string;
//   top_conviction_law?: string;
//   top_conviction_article_section?: string;
//   top_conviction_attempt_indicator?: string;
//   top_charge_at_conviction?: string;
//   top_charge_severity_at_conviction?: string;
//   top_charge_weight_at_conviction?: string;
//   top_charge_at_conviction_violent_felony_ind?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface County {
//   county_id: string;
//   county_name: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Court {
//   court_id: string;
//   court_name: string;
//   court_ori: string;
//   county_name: string;
//   district: string;
//   region: string;
//   court_type: string;
//   cases: Case[];
// }
//
// export interface Defendant {
//   defendant_id: string;
//   gender?: string;
//   race?: string;
//   ethnicity?: string;
//   age_at_crime?: string;
//   age_at_arrest?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Disposition {
//   disposition_id: string;
//   docket_status?: string;
//   disposition_type?: string;
//   disposition_detail?: string;
//   dismissal_reason?: string;
//   most_severe_sentence?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Judge {
//   judge_id: string;
//   judge_name: string;
//   case_count: number;
//   primary_county?: string;
//   counties: Array<Record<string, any>>;
//   arraignment_statistics: ArraignmentStatistics[];
//   bail_statistics: BailStatistics[];
//   cases: Case[];
//   percentiles: Percentile[];
// }
//
// export interface Prior {
//   prior_id: string;
//   prior_vfo_cnt?: string;
//   prior_nonvfo_cnt?: string;
//   prior_misd_cnt?: string;
//   pend_vfo?: string;
//   pend_nonvfo?: string;
//   pend_misd?: string;
//   supervision?: string;
//   rearrest?: string;
//   rearrest_firearm?: string;
//   case_count: number;
//   cases: Case[];
// }
//
// export interface Warrant {
//   warrant_id: string;
//   warrant_ordered_btw_arraign_and_dispo?: string;
//   dat_wo_ws_prior_to_arraign?: string;
//   non_stayed_wo?: string;
//   num_of_stayed_wo?: string;
//   num_of_row?: number;
//   case_count: number;
//   cases: Case[];
// }
//
