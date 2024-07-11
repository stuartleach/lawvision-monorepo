-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "pretrial_slim";

-- CreateTable
CREATE TABLE "pretrial_slim"."cases_raw" (
    "internal_case_id" TEXT,
    "gender" TEXT,
    "race" TEXT,
    "ethnicity" TEXT,
    "age_at_crime" TEXT,
    "age_at_arrest" TEXT,
    "court_name" TEXT,
    "court_ori" TEXT,
    "county_name" TEXT,
    "district" TEXT,
    "region" TEXT,
    "court_type" TEXT,
    "judge_name" TEXT,
    "offense_month" TEXT,
    "offense_year" TEXT,
    "arrest_month" TEXT,
    "arrest_year" TEXT,
    "arrest_type" TEXT,
    "top_arrest_law" TEXT,
    "top_arrest_article_section" TEXT,
    "top_arrest_attempt_indicator" TEXT,
    "top_charge_at_arrest" TEXT,
    "top_charge_severity_at_arrest" TEXT,
    "top_charge_weight_at_arrest" TEXT,
    "top_charge_at_arrest_violent_felony_ind" TEXT,
    "case_type" TEXT,
    "first_arraign_date" TEXT,
    "top_arraign_law" TEXT,
    "top_arraign_article_section" TEXT,
    "top_arraign_attempt_indicator" TEXT,
    "top_charge_at_arraign" TEXT,
    "top_severity_at_arraign" TEXT,
    "top_charge_weight_at_arraign" TEXT,
    "top_charge_at_arraign_violent_felony_ind" TEXT,
    "hate_crime_ind" TEXT,
    "arraign_charge_category" TEXT,
    "representation_type" TEXT,
    "app_count_arraign_to_dispo_released" TEXT,
    "app_count_arraign_to_dispo_detained" TEXT,
    "app_count_arraign_to_dispo_total" TEXT,
    "def_attended_sched_pretrials" TEXT,
    "remanded_to_jail_at_arraign" TEXT,
    "ror_at_arraign" TEXT,
    "bail_set_and_posted_at_arraign" TEXT,
    "bail_set_and_not_posted_at_arraign" TEXT,
    "nmr_at_arraign" TEXT,
    "release_decision_at_arraign" TEXT,
    "representation_at_securing_order" TEXT,
    "pretrial_supervision_at_arraign" TEXT,
    "contact_pretrial_service_agency" TEXT,
    "electronic_monitoring" TEXT,
    "travel_restrictions" TEXT,
    "passport_surrender" TEXT,
    "no_firearms_or_weapons" TEXT,
    "maintain_employment" TEXT,
    "maintain_housing" TEXT,
    "maintain_school" TEXT,
    "placement_in_mandatory_program" TEXT,
    "removal_to_hospital" TEXT,
    "obey_order_of_protection" TEXT,
    "obey_court_conditions_family_offense" TEXT,
    "other_nmr" TEXT,
    "order_of_protection" TEXT,
    "first_bail_set_cash" TEXT,
    "first_bail_set_credit" TEXT,
    "first_insurance_company_bail_bond" TEXT,
    "first_secured_surety_bond" TEXT,
    "first_secured_app_bond" TEXT,
    "first_unsecured_surety_bond" TEXT,
    "first_unsecured_app_bond" TEXT,
    "first_partially_secured_surety_bond" TEXT,
    "partially_secured_surety_bond_perc" TEXT,
    "first_partially_secured_app_bond" TEXT,
    "partially_secured_app_bond_perc" TEXT,
    "bail_made_indicator" TEXT,
    "warrant_ordered_btw_arraign_and_dispo" TEXT,
    "dat_wo_ws_prior_to_arraign" TEXT,
    "first_bench_warrant_date" TEXT,
    "non_stayed_wo" TEXT,
    "num_of_stayed_wo" TEXT,
    "num_of_row" INTEGER,
    "docket_status" TEXT,
    "disposition_type" TEXT,
    "disposition_detail" TEXT,
    "dismissal_reason" TEXT,
    "disposition_date" TEXT,
    "most_severe_sentence" TEXT,
    "top_conviction_law" TEXT,
    "top_conviction_article_section" TEXT,
    "top_conviction_attempt_indicator" TEXT,
    "top_charge_at_conviction" TEXT,
    "top_charge_severity_at_conviction" TEXT,
    "top_charge_weight_at_conviction" TEXT,
    "top_charge_at_conviction_violent_felony_ind" TEXT,
    "days_arraign_remand_first_released" TEXT,
    "known_days_in_custody" TEXT,
    "days_arraign_bail_set_to_first_posted" TEXT,
    "days_arraign_bail_set_to_first_release" TEXT,
    "days_arraign_to_dispo" TEXT,
    "ucmslivedate" TEXT,
    "prior_vfo_cnt" TEXT,
    "prior_nonvfo_cnt" TEXT,
    "prior_misd_cnt" TEXT,
    "pend_vfo" TEXT,
    "pend_nonvfo" TEXT,
    "pend_misd" TEXT,
    "supervision" TEXT,
    "rearrest" TEXT,
    "rearrest_date" TEXT,
    "rearrest_firearm" TEXT,
    "rearrest_date_firearm" TEXT,
    "arr_cycle_id" TEXT,
    "case_raw_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "cases_raw_pk" PRIMARY KEY ("case_raw_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."cases" (
    "case_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "internal_case_id" TEXT,
    "case_type" TEXT,
    "court_id" UUID,
    "judge_id" UUID,
    "county_id" UUID,
    "defendant_id" UUID,
    "arraignment_id" UUID,
    "appearance_id" UUID,
    "condition_id" UUID,
    "bail_id" UUID,
    "warrant_id" UUID,
    "disposition_id" UUID,
    "calculated_days_id" UUID,
    "prior_record_id" UUID,

    CONSTRAINT "cases_pk" PRIMARY KEY ("case_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."judges" (
    "judge_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "judge_name" TEXT NOT NULL,
    "case_count" INTEGER DEFAULT 0,
    "counties" TEXT[],
    "primary_county" TEXT,

    CONSTRAINT "judges_pkey1" PRIMARY KEY ("judge_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."arraignment_statistics" (
    "arraignment_stat_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "judge_id" UUID NOT NULL,
    "stat_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "count" INTEGER DEFAULT 0,
    "percentage" DECIMAL DEFAULT 0,
    "race" TEXT,

    CONSTRAINT "arraignment_statistics_pkey" PRIMARY KEY ("arraignment_stat_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."bail_statistics" (
    "bail_stat_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "judge_id" UUID NOT NULL,
    "total_bail_set" DECIMAL DEFAULT 0,
    "average_bail_set" DECIMAL DEFAULT 0,
    "severity" TEXT,
    "race" TEXT,

    CONSTRAINT "bail_statistics_pkey" PRIMARY KEY ("bail_stat_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."percentiles" (
    "percentile_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "judge_id" UUID NOT NULL,
    "percentile_type" TEXT NOT NULL,
    "percentile_value" DECIMAL,

    CONSTRAINT "percentiles_pkey" PRIMARY KEY ("percentile_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."races" (
    "race_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "race_name" TEXT,

    CONSTRAINT "races_pkey" PRIMARY KEY ("race_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."defendants" (
    "defendant_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gender" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "age_at_crime" TEXT NOT NULL,
    "age_at_arrest" TEXT NOT NULL,

    CONSTRAINT "defendants_pkey" PRIMARY KEY ("defendant_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."courts" (
    "court_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "court_name" TEXT NOT NULL,
    "court_ori" TEXT NOT NULL,
    "county_name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "court_type" TEXT NOT NULL,
    "judge_name" TEXT NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("court_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."arrests" (
    "arrest_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "internal_case_id" TEXT NOT NULL,
    "offense_month" TEXT,
    "offense_year" TEXT,
    "arrest_month" TEXT,
    "arrest_year" TEXT,
    "arrest_type" TEXT,
    "top_arrest_law" TEXT,
    "top_arrest_article_section" TEXT,
    "top_arrest_attempt_indicator" TEXT,
    "top_charge_at_arrest" TEXT,
    "top_charge_severity_at_arrest" TEXT,
    "top_charge_weight_at_arrest" TEXT,
    "top_charge_at_arrest_violent_felony_ind" TEXT,
    "arr_cycle_id" TEXT,

    CONSTRAINT "arrests_pkey" PRIMARY KEY ("arrest_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."arraignments" (
    "arraignment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "case_type" TEXT,
    "first_arraign_date" TEXT,
    "top_arraign_law" TEXT,
    "top_arraign_article_section" TEXT,
    "top_arraign_attempt_indicator" TEXT,
    "top_charge_at_arraign" TEXT,
    "top_severity_at_arraign" TEXT,
    "top_charge_weight_at_arraign" TEXT,
    "top_charge_at_arraign_violent_felony_ind" TEXT,
    "hate_crime_ind" TEXT,
    "arraign_charge_category" TEXT,

    CONSTRAINT "arraignments_pkey" PRIMARY KEY ("arraignment_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."appearances" (
    "appearance_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "representation_type" TEXT,
    "app_count_arraign_to_dispo_released" TEXT,
    "app_count_arraign_to_dispo_detained" TEXT,
    "app_count_arraign_to_dispo_total" TEXT,
    "def_attended_sched_pretrials" TEXT,
    "remanded_to_jail_at_arraign" TEXT,
    "ror_at_arraign" TEXT,
    "bail_set_and_posted_at_arraign" TEXT,
    "bail_set_and_not_posted_at_arraign" TEXT,
    "nmr_at_arraign" TEXT,
    "release_decision_at_arraign" TEXT,
    "representation_at_securing_order" TEXT,

    CONSTRAINT "appearances_pkey" PRIMARY KEY ("appearance_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."conditions" (
    "condition_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pretrial_supervision_at_arraign" TEXT,
    "contact_pretrial_service_agency" TEXT,
    "electronic_monitoring" TEXT,
    "travel_restrictions" TEXT,
    "passport_surrender" TEXT,
    "no_firearms_or_weapons" TEXT,
    "maintain_employment" TEXT,
    "maintain_housing" TEXT,
    "maintain_school" TEXT,
    "placement_in_mandatory_program" TEXT,
    "removal_to_hospital" TEXT,
    "obey_order_of_protection" TEXT,
    "obey_court_conditions_family_offense" TEXT,
    "other_nmr" TEXT,
    "order_of_protection" TEXT,

    CONSTRAINT "conditions_pkey" PRIMARY KEY ("condition_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."bails" (
    "bail_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_bail_set_cash" TEXT,
    "first_bail_set_credit" TEXT,
    "first_insurance_company_bail_bond" TEXT,
    "first_secured_surety_bond" TEXT,
    "first_secured_app_bond" TEXT,
    "first_unsecured_surety_bond" TEXT,
    "first_unsecured_app_bond" TEXT,
    "first_partially_secured_surety_bond" TEXT,
    "partially_secured_surety_bond_perc" TEXT,
    "first_partially_secured_app_bond" TEXT,
    "partially_secured_app_bond_perc" TEXT,
    "bail_made_indicator" TEXT,

    CONSTRAINT "bails_pkey" PRIMARY KEY ("bail_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."warrants" (
    "warrant_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "warrant_ordered_btw_arraign_and_dispo" TEXT,
    "dat_wo_ws_prior_to_arraign" TEXT,
    "first_bench_warrant_date" TEXT,
    "non_stayed_wo" TEXT,
    "num_of_stayed_wo" TEXT,
    "num_of_row" INTEGER,

    CONSTRAINT "warrants_pkey" PRIMARY KEY ("warrant_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."dispositions" (
    "disposition_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "docket_status" TEXT,
    "disposition_type" TEXT,
    "disposition_detail" TEXT,
    "dismissal_reason" TEXT,
    "disposition_date" TEXT,
    "most_severe_sentence" TEXT,
    "top_conviction_law" TEXT,
    "top_conviction_article_section" TEXT,
    "top_conviction_attempt_indicator" TEXT,
    "top_charge_at_conviction" TEXT,
    "top_charge_severity_at_conviction" TEXT,
    "top_charge_weight_at_conviction" TEXT,
    "top_charge_at_conviction_violent_felony_ind" TEXT,

    CONSTRAINT "dispositions_pkey" PRIMARY KEY ("disposition_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."calculated_days" (
    "calculated_days_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "days_arraign_remand_first_released" TEXT,
    "known_days_in_custody" TEXT,
    "days_arraign_bail_set_to_first_posted" TEXT,
    "days_arraign_bail_set_to_first_release" TEXT,
    "days_arraign_to_dispo" TEXT,
    "ucmslivedate" TEXT,

    CONSTRAINT "calculated_days_pkey" PRIMARY KEY ("calculated_days_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."priors" (
    "prior_record_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prior_vfo_cnt" TEXT,
    "prior_nonvfo_cnt" TEXT,
    "prior_misd_cnt" TEXT,
    "pend_vfo" TEXT,
    "pend_nonvfo" TEXT,
    "pend_misd" TEXT,
    "supervision" TEXT,
    "rearrest" TEXT,
    "rearrest_date" TEXT,
    "rearrest_firearm" TEXT,
    "rearrest_date_firearm" TEXT,

    CONSTRAINT "priors_pkey" PRIMARY KEY ("prior_record_id")
);

-- CreateTable
CREATE TABLE "pretrial_slim"."counties" (
    "county_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "county_name" TEXT NOT NULL,

    CONSTRAINT "counties_pkey" PRIMARY KEY ("county_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "judges_judge_name_key1" ON "pretrial_slim"."judges"("judge_name");

-- CreateIndex
CREATE UNIQUE INDEX "arraignment_statistics_judge_id_stat_type_severity_race_key" ON "pretrial_slim"."arraignment_statistics"("judge_id", "stat_type", "severity", "race");

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "pretrial_slim"."judges"("judge_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "pretrial_slim"."counties"("county_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "pretrial_slim"."courts"("court_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_defendant_id_fkey" FOREIGN KEY ("defendant_id") REFERENCES "pretrial_slim"."defendants"("defendant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_arraignment_id_fkey" FOREIGN KEY ("arraignment_id") REFERENCES "pretrial_slim"."arraignments"("arraignment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_appearance_id_fkey" FOREIGN KEY ("appearance_id") REFERENCES "pretrial_slim"."appearances"("appearance_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "pretrial_slim"."conditions"("condition_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_bail_id_fkey" FOREIGN KEY ("bail_id") REFERENCES "pretrial_slim"."bails"("bail_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_warrant_id_fkey" FOREIGN KEY ("warrant_id") REFERENCES "pretrial_slim"."warrants"("warrant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_disposition_id_fkey" FOREIGN KEY ("disposition_id") REFERENCES "pretrial_slim"."dispositions"("disposition_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_calculated_days_id_fkey" FOREIGN KEY ("calculated_days_id") REFERENCES "pretrial_slim"."calculated_days"("calculated_days_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."cases" ADD CONSTRAINT "cases_prior_record_id_fkey" FOREIGN KEY ("prior_record_id") REFERENCES "pretrial_slim"."priors"("prior_record_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."arraignment_statistics" ADD CONSTRAINT "arraignment_statistics_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "pretrial_slim"."judges"("judge_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."bail_statistics" ADD CONSTRAINT "bail_statistics_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "pretrial_slim"."judges"("judge_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pretrial_slim"."percentiles" ADD CONSTRAINT "percentiles_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "pretrial_slim"."judges"("judge_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
