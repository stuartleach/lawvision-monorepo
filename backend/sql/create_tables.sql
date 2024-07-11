create table pretrial_slim.cases
(
    internal_case_id                            text,
    gender                                      text,
    race                                        text,
    ethnicity                                   text,
    age_at_crime                                text,
    age_at_arrest                               text,
    court_name                                  text,
    court_ori                                   text,
    county_name                                 text,
    district                                    text,
    region                                      text,
    court_type                                  text,
    judge_name                                  text,
    offense_month                               text,
    offense_year                                text,
    arrest_month                                text,
    arrest_year                                 text,
    arrest_type                                 text,
    top_arrest_law                              text,
    top_arrest_article_section                  text,
    top_arrest_attempt_indicator                text,
    top_charge_at_arrest                        text,
    top_charge_severity_at_arrest               text,
    top_charge_weight_at_arrest                 text,
    top_charge_at_arrest_violent_felony_ind     text,
    case_type                                   text,
    first_arraign_date                          text,
    top_arraign_law                             text,
    top_arraign_article_section                 text,
    top_arraign_attempt_indicator               text,
    top_charge_at_arraign                       text,
    top_severity_at_arraign                     text,
    top_charge_weight_at_arraign                text,
    top_charge_at_arraign_violent_felony_ind    text,
    hate_crime_ind                              text,
    arraign_charge_category                     text,
    representation_type                         text,
    app_count_arraign_to_dispo_released         text,
    app_count_arraign_to_dispo_detained         text,
    app_count_arraign_to_dispo_total            text,
    def_attended_sched_pretrials                text,
    remanded_to_jail_at_arraign                 text,
    ror_at_arraign                              text,
    bail_set_and_posted_at_arraign              text,
    bail_set_and_not_posted_at_arraign          text,
    nmr_at_arraign                              text,
    release_decision_at_arraign                 text,
    representation_at_securing_order            text,
    pretrial_supervision_at_arraign             text,
    contact_pretrial_service_agency             text,
    electronic_monitoring                       text,
    travel_restrictions                         text,
    passport_surrender                          text,
    no_firearms_or_weapons                      text,
    maintain_employment                         text,
    maintain_housing                            text,
    maintain_school                             text,
    placement_in_mandatory_program              text,
    removal_to_hospital                         text,
    obey_order_of_protection                    text,
    obey_court_conditions_family_offense        text,
    other_nmr                                   text,
    order_of_protection                         text,
    first_bail_set_cash                         text,
    first_bail_set_credit                       text,
    first_insurance_company_bail_bond           text,
    first_secured_surety_bond                   text,
    first_secured_app_bond                      text,
    first_unsecured_surety_bond                 text,
    first_unsecured_app_bond                    text,
    first_partially_secured_surety_bond         text,
    partially_secured_surety_bond_perc          text,
    first_partially_secured_app_bond            text,
    partially_secured_app_bond_perc             text,
    bail_made_indicator                         text,
    warrant_ordered_btw_arraign_and_dispo       text,
    dat_wo_ws_prior_to_arraign                  text,
    first_bench_warrant_date                    text,
    non_stayed_wo                               text,
    num_of_stayed_wo                            text,
    num_of_row                                  integer,
    docket_status                               text,
    disposition_type                            text,
    disposition_detail                          text,
    dismissal_reason                            text,
    disposition_date                            text,
    most_severe_sentence                        text,
    top_conviction_law                          text,
    top_conviction_article_section              text,
    top_conviction_attempt_indicator            text,
    top_charge_at_conviction                    text,
    top_charge_severity_at_conviction           text,
    top_charge_weight_at_conviction             text,
    top_charge_at_conviction_violent_felony_ind text,
    days_arraign_remand_first_released          text,
    known_days_in_custody                       text,
    days_arraign_bail_set_to_first_posted       text,
    days_arraign_bail_set_to_first_release      text,
    days_arraign_to_dispo                       text,
    ucmslivedate                                text,
    prior_vfo_cnt                               text,
    prior_nonvfo_cnt                            text,
    prior_misd_cnt                              text,
    pend_vfo                                    text,
    pend_nonvfo                                 text,
    pend_misd                                   text,
    supervision                                 text,
    rearrest                                    text,
    rearrest_date                               text,
    rearrest_firearm                            text,
    rearrest_date_firearm                       text,
    arr_cycle_id                                text,
    case_id                                     uuid default gen_random_uuid() not null
        constraint cases_pk
            primary key,
    judge_id                                    uuid
        constraint fk_judge
            references pretrial_slim.judges,
    county_id                                   uuid
        constraint fk_county
            references pretrial_slim.counties
);

create table pretrial_slim.counties
(
    county_id                   uuid    default gen_random_uuid() not null
        constraint county_pkey
            primary key,
    county_name                 text                              not null
        constraint county_county_name_key
            unique,
    case_count                  integer default 0,
    judges                      text[],
    median_income               integer,
    percentile_state_case_count numeric
);



CREATE TABLE pretrial_slim.judges
(
    judge_id       UUID    DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    judge_name     TEXT                              NOT NULL
        constraint judge_judge_name_key UNIQUE,
    case_count     INTEGER DEFAULT 0,
    counties       TEXT[],
    primary_county TEXT
);

CREATE TABLE pretrial_slim.arraignment_statistics
(
    stat_id    UUID    DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    judge_id   UUID                              NOT NULL REFERENCES pretrial_slim.judges (judge_id),
    stat_type  TEXT                              NOT NULL, -- e.g., 'remand_at_arraign', 'ror_at_arraign', etc.
    severity   TEXT                              NOT NULL, -- e.g., 'AF', 'BF', 'CF', etc.
    race       TEXT,
    count      INTEGER DEFAULT 0,
    percentage NUMERIC DEFAULT 0
);

CREATE TABLE pretrial_slim.percentiles
(
    percentile_id    UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    judge_id         UUID                           NOT NULL REFERENCES pretrial_slim.judges (judge_id),
    percentile_type  TEXT                           NOT NULL, -- e.g., 'state_bail_set_percentage_AF', 'county_bail_set_percentage_AF', 'state_bail_set_percentage_BF' etc.
    percentile_value NUMERIC
);

CREATE TABLE pretrial_slim.bail_statistics
(
    bail_stat_id     UUID    DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    judge_id         UUID                              NOT NULL REFERENCES pretrial_slim.judges (judge_id),
    total_bail_set   NUMERIC DEFAULT 0,
    average_bail_set NUMERIC DEFAULT 0,
    race             TEXT,
    severity         TEXT
);


CREATE TABLE pretrial_slim.counties
(
    county_id   UUID    DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    county_name TEXT                              NOT NULL UNIQUE,
    judges      TEXT[],
    case_count  INTEGER DEFAULT 0
);

CREATE TABLE pretrial_slim.races
(
    race_id    UUID    DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    race_name  TEXT,
    case_count INTEGER DEFAULT 0
);


