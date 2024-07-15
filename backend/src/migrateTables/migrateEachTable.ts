import { PrismaClient } from '@prisma/client';
// @ts-ignore
import type { CaseRawType } from './types';

const prisma = new PrismaClient();

const deleteBailOutliers = async () => {
	try {
		const bailOutliers = await prisma.caseRaw.findMany({
			where: {
				first_bail_set_cash: {
					gt: 10000000
				}
			}
		});
		console.log('Deleting bail outliers', bailOutliers.length);
		await prisma.caseRaw.deleteMany({
			where: {
				first_bail_set_cash: {
					gt: 10000000
				}
			}
		});
	} catch (e) {
		console.error('Failed to delete bail outliers', e);
	}
}

export async function clearTables(): Promise<void> {
	try {
		// await deleteJudgelessCases(); // Uncomment if needed on next import.
		// await deleteBailOutliers(); // Done manually already. Uncomment if needed on next import.

		await prisma.judge.deleteMany({});
		await prisma.court.deleteMany({});
		await prisma.county.deleteMany({});
		await prisma.defendant.deleteMany({});
		await prisma.appearance.deleteMany({});
		await prisma.warrant.deleteMany({});
		await prisma.prior.deleteMany({});
		await prisma.disposition.deleteMany({});
		await prisma.conditions.deleteMany({});
		await prisma.calculatedDays.deleteMany({});
		await prisma.bail.deleteMany({});
		await prisma.arrest.deleteMany({});
		await prisma.case.deleteMany({});
		await prisma.caseDetails.deleteMany({});
		await prisma.conviction.deleteMany({});
		await prisma.arraignCharge.deleteMany({});
		await prisma.arraignmentOutcome.deleteMany({});
		await prisma.representation.deleteMany({});
		console.log('Deleted all existing data');
	} catch (error) {
		console.error(error);
	}
}

export const RAW_CASE_BATCH_SIZE = 10000; // Adjust the size of each raw case fetch batch
export const BATCH_SIZE = 100; // Adjust this size based on your memory capacity

export async function getRawCases(offset: number = 0, limit: number = RAW_CASE_BATCH_SIZE) {
	const rawCases = await prisma.caseRaw.findMany({
		skip: offset,
		take: limit
	});
	console.log(`Fetched ${rawCases.length} records from cases`);
	return rawCases;
}

export async function deleteJudgelessCases() {
	try {
		await prisma.caseRaw.deleteMany({
			where: {
				judge_name: 'Judge/JHO/Hearing Examiner, Visiting'
			}
		});
		await prisma.caseRaw.deleteMany({
			where: {
				judge_name: 'Office, Clerk\'s'
			}
		});
		console.log('Deleted judgeless cases');
	} catch (e) {
		console.error('Failed to delete judgeless cases', e);
	}
}

export async function findOrCreateAppearance(raw: CaseRawType) {
	let appearance = await prisma.appearance.findFirst({
		where: {
			app_count_arraign_to_dispo_released: raw.app_count_arraign_to_dispo_released,
			app_count_arraign_to_dispo_detained: raw.app_count_arraign_to_dispo_detained,
			app_count_arraign_to_dispo_total: raw.app_count_arraign_to_dispo_total,
			def_attended_sched_pretrials: raw.def_attended_sched_pretrials

		}
	});
	if (!appearance) {
		appearance = await prisma.appearance.create({
			data: {
				app_count_arraign_to_dispo_released: raw.app_count_arraign_to_dispo_released,
				app_count_arraign_to_dispo_detained: raw.app_count_arraign_to_dispo_detained,
				app_count_arraign_to_dispo_total: raw.app_count_arraign_to_dispo_total,
				def_attended_sched_pretrials: raw.def_attended_sched_pretrials
			}
		});
	} else {
		await prisma.appearance.update({
			where: {
				appearance_id: appearance.appearance_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}
	return appearance;
}

export async function findOrCreateArraignCharge(raw: CaseRawType) {
	let arraignCharge = await prisma.arraignCharge.findFirst({
		where: {
			case_type: raw.case_type,
			top_arraign_law: raw.top_arraign_law,
			top_arraign_article_section: raw.top_arraign_article_section,
			top_arraign_attempt_indicator: raw.top_arraign_attempt_indicator,
			top_charge_at_arraign: raw.top_charge_at_arraign,
			top_severity_at_arraign: raw.top_severity_at_arraign,
			top_charge_weight_at_arraign: raw.top_charge_weight_at_arraign,
			top_charge_at_arraign_violent_felony_ind: raw.top_charge_at_arraign_violent_felony_ind,
			hate_crime_ind: raw.hate_crime_ind,
			arraign_charge_category: raw.arraign_charge_category
		}
	});

	if (!arraignCharge) {
		arraignCharge = await prisma.arraignCharge.create({
			data: {
				case_type: raw.case_type,
				top_arraign_law: raw.top_arraign_law,
				top_arraign_article_section: raw.top_arraign_article_section,
				top_arraign_attempt_indicator: raw.top_arraign_attempt_indicator,
				top_charge_at_arraign: raw.top_charge_at_arraign,
				top_severity_at_arraign: raw.top_severity_at_arraign,
				top_charge_weight_at_arraign: raw.top_charge_weight_at_arraign,
				top_charge_at_arraign_violent_felony_ind: raw.top_charge_at_arraign_violent_felony_ind,
				hate_crime_ind: raw.hate_crime_ind,
				arraign_charge_category: raw.arraign_charge_category,
				case_count: 1
			}
		});
	} else {
		await prisma.arraignCharge.update({
			where: {
				arraign_charge_id: arraignCharge.arraign_charge_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}
	return arraignCharge;
}

export async function findOrCreateArraignmentOutcome(raw: CaseRawType) {
	let arraignmentOutcome = await prisma.arraignmentOutcome.findFirst({
		where: {
			remanded_to_jail_at_arraign: raw.remanded_to_jail_at_arraign,
			ror_at_arraign: raw.ror_at_arraign,
			bail_set_and_posted_at_arraign: raw.bail_set_and_posted_at_arraign,
			bail_set_and_not_posted_at_arraign: raw.bail_set_and_not_posted_at_arraign,
			nmr_at_arraign: raw.nmr_at_arraign,
			release_decision_at_arraign: raw.release_decision_at_arraign
		}
	});

	if (!arraignmentOutcome) {
		arraignmentOutcome = await prisma.arraignmentOutcome.create({
			data: {
				remanded_to_jail_at_arraign: raw.remanded_to_jail_at_arraign,
				ror_at_arraign: raw.ror_at_arraign,
				bail_set_and_posted_at_arraign: raw.bail_set_and_posted_at_arraign,
				bail_set_and_not_posted_at_arraign: raw.bail_set_and_not_posted_at_arraign,
				nmr_at_arraign: raw.nmr_at_arraign,
				release_decision_at_arraign: raw.release_decision_at_arraign,
				case_count: 1
			}
		});
	} else {
		arraignmentOutcome = await prisma.arraignmentOutcome.update({
			where: {
				arraignment_outcome_id: arraignmentOutcome.arraignment_outcome_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}

	return arraignmentOutcome;
}

export async function findOrCreateRepresentation(raw: CaseRawType) {
	let representation = await prisma.representation.findFirst({
		where: {
			representation_type: raw.representation_type,
			representation_at_securing_order: raw.representation_at_securing_order
		}
	});
	if (!representation) {
		representation = await prisma.representation.create({
			data: {
				representation_type: raw.representation_type,
				representation_at_securing_order: raw.representation_at_securing_order,
				case_count: 1
			}
		});
	} else {
		await prisma.representation.update({
			where: {
				representation_id: representation.representation_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}
	return representation;
}

export async function findOrCreateConviction(raw: CaseRawType) {

	let conviction = await prisma.conviction.findFirst({
		where: {
			top_conviction_law: raw.top_conviction_law,
			top_conviction_article_section: raw.top_conviction_article_section,
			top_conviction_attempt_indicator: raw.top_conviction_attempt_indicator,
			top_charge_at_conviction: raw.top_charge_at_conviction,
			top_charge_severity_at_conviction: raw.top_charge_severity_at_conviction,
			top_charge_weight_at_conviction: raw.top_charge_weight_at_conviction,
			top_charge_at_conviction_violent_felony_ind: raw.top_charge_at_conviction_violent_felony_ind
		}
	});

	if (!conviction) {
		conviction = await prisma.conviction.create({
			data: {
				top_conviction_law: raw.top_conviction_law,
				top_conviction_article_section: raw.top_conviction_article_section,
				top_conviction_attempt_indicator: raw.top_conviction_attempt_indicator,
				top_charge_at_conviction: raw.top_charge_at_conviction,
				top_charge_severity_at_conviction: raw.top_charge_severity_at_conviction,
				top_charge_weight_at_conviction: raw.top_charge_weight_at_conviction,
				top_charge_at_conviction_violent_felony_ind: raw.top_charge_at_conviction_violent_felony_ind,
				case_count: 1
			}
		});
	} else {
		await prisma.conviction.update({
			where: {
				conviction_id: conviction.conviction_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}
	return conviction;
}

export async function findOrCreateCondition(raw: CaseRawType) {
	let condition = await prisma.conditions.findFirst({
		where: {
			contact_pretrial_service_agency: raw.contact_pretrial_service_agency,
			electronic_monitoring: raw.electronic_monitoring,
			travel_restrictions: raw.travel_restrictions,
			passport_surrender: raw.passport_surrender,
			no_firearms_or_weapons: raw.no_firearms_or_weapons,
			maintain_employment: raw.maintain_employment,
			maintain_housing: raw.maintain_housing,
			maintain_school: raw.maintain_school,
			placement_in_mandatory_program: raw.placement_in_mandatory_program,
			removal_to_hospital: raw.removal_to_hospital,
			obey_order_of_protection: raw.obey_order_of_protection,
			obey_court_conditions_family_offense: raw.obey_court_conditions_family_offense,
			other_nmr: raw.other_nmr,
			order_of_protection: raw.order_of_protection
		}
	});
	if (!condition) {
		condition = await prisma.conditions.create({
			data: {
				pretrial_supervision_at_arraign: raw.pretrial_supervision_at_arraign,
				contact_pretrial_service_agency: raw.contact_pretrial_service_agency,
				electronic_monitoring: raw.electronic_monitoring,
				travel_restrictions: raw.travel_restrictions,
				passport_surrender: raw.passport_surrender,
				no_firearms_or_weapons: raw.no_firearms_or_weapons,
				maintain_employment: raw.maintain_employment,
				maintain_housing: raw.maintain_housing,
				maintain_school: raw.maintain_school,
				placement_in_mandatory_program: raw.placement_in_mandatory_program,
				removal_to_hospital: raw.removal_to_hospital,
				obey_order_of_protection: raw.obey_order_of_protection,
				obey_court_conditions_family_offense: raw.obey_court_conditions_family_offense,
				other_nmr: raw.other_nmr,
				order_of_protection: raw.order_of_protection
			}
		});
	} else {
		await prisma.conditions.update({
			where: {
				condition_id: condition.condition_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}

	return condition;
}

export async function findOrCreateDisposition(raw: CaseRawType) {
	let disposition = await prisma.disposition.findFirst({
		where: {
			docket_status: raw.docket_status,
			disposition_type: raw.disposition_type,
			disposition_detail: raw.disposition_detail,
			dismissal_reason: raw.dismissal_reason,
			most_severe_sentence: raw.most_severe_sentence
		}
	});

	if (!disposition) {
		disposition = await prisma.disposition.create({
			data: {
				docket_status: raw.docket_status,
				disposition_type: raw.disposition_type,
				disposition_detail: raw.disposition_detail,
				dismissal_reason: raw.dismissal_reason,
				most_severe_sentence: raw.most_severe_sentence
			}
		});
	} else {
		disposition = await prisma.disposition.update({
			where: {
				disposition_id: disposition.disposition_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}

	return disposition;
}

export async function findOrCreatePrior(raw: CaseRawType) {

	let prior = await prisma.prior.findFirst({
		where: {
			prior_vfo_cnt: raw?.prior_vfo_cnt ?? '',
			prior_nonvfo_cnt: raw.prior_nonvfo_cnt ?? '',
			prior_misd_cnt: raw.prior_misd_cnt ?? '',
			pend_vfo: raw.pend_vfo ?? '',
			pend_nonvfo: raw.pend_nonvfo ?? '',
			pend_misd: raw.pend_misd ?? '',
			supervision: raw.supervision ?? '',
			rearrest: raw.rearrest ?? '',
			rearrest_firearm: raw.rearrest_firearm ?? ''
		}
	});

	if (!prior) {
		prior = await prisma.prior.create({
			data: {
				prior_vfo_cnt: raw.prior_vfo_cnt,
				prior_nonvfo_cnt: raw.prior_nonvfo_cnt,
				prior_misd_cnt: raw.prior_misd_cnt,
				pend_vfo: raw.pend_vfo,
				pend_nonvfo: raw.pend_nonvfo,
				pend_misd: raw.pend_misd,
				supervision: raw.supervision,
				rearrest: raw.rearrest,
				rearrest_firearm: raw.rearrest_firearm,
				case_count: 1
			}
		});
	} else {
		await prisma.prior.update({
			where: {
				prior_id: prior.prior_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}

	return prior;
}

export async function createCaseDetails(raw: CaseRawType) {
	return prisma.caseDetails.create({
		data: {
			rearrest_date: raw.rearrest_date,
			offense_month: raw.offense_month,
			offense_year: raw.offense_year,
			arrest_month: raw.arrest_month,
			arrest_year: raw.arrest_year,
			rearrest_date_firearm: raw.rearrest_date_firearm,
			ucmslivedate: raw.ucmslivedate,
			internal_case_id: raw.internal_case_id,
			first_arraign_date: raw.first_arraign_date,
			first_bench_warrant_date: raw.first_bench_warrant_date,
			disposition_date: raw.disposition_date,
			arr_cycle_id: raw.arr_cycle_id
		}
	});

}

export async function findOrCreateCalculatedDays(raw: CaseRawType) {

	let calculatedDays = await prisma.calculatedDays.findFirst({
		where: {
			days_arraign_remand_first_released: raw.days_arraign_remand_first_released,
			known_days_in_custody: raw.known_days_in_custody,
			days_arraign_bail_set_to_first_posted: raw.days_arraign_bail_set_to_first_posted,
			days_arraign_bail_set_to_first_release: raw.days_arraign_bail_set_to_first_release,
			days_arraign_to_dispo: raw.days_arraign_to_dispo
		}
	});

	if (!calculatedDays) {
		calculatedDays = await prisma.calculatedDays.create({
			data: {
				days_arraign_remand_first_released: raw.days_arraign_remand_first_released,
				known_days_in_custody: raw.known_days_in_custody,
				days_arraign_bail_set_to_first_posted: raw.days_arraign_bail_set_to_first_posted,
				days_arraign_bail_set_to_first_release: raw.days_arraign_bail_set_to_first_release,
				days_arraign_to_dispo: raw.days_arraign_to_dispo,
				case_count: 1
			}
		});
	} else {
		calculatedDays = await prisma.calculatedDays.update({
			where: {
				calculated_days_id: calculatedDays.calculated_days_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}
	return calculatedDays;
}

export async function findOrCreateBail(raw: CaseRawType) {

	let bail = await prisma.bail.findFirst({
		where: {
			first_bail_set_cash: raw.first_bail_set_cash,
			first_bail_set_credit: raw.first_bail_set_credit,
			first_insurance_company_bail_bond: raw.first_insurance_company_bail_bond,
			first_secured_surety_bond: raw.first_secured_surety_bond,
			first_secured_app_bond: raw.first_secured_app_bond,
			first_unsecured_surety_bond: raw.first_unsecured_surety_bond,
			first_unsecured_app_bond: raw.first_unsecured_app_bond,
			first_partially_secured_surety_bond: raw.first_partially_secured_surety_bond,
			partially_secured_surety_bond_perc: raw.partially_secured_surety_bond_perc,
			first_partially_secured_app_bond: raw.first_partially_secured_app_bond,
			partially_secured_app_bond_perc: raw.partially_secured_app_bond_perc,
			bail_made_indicator: raw.bail_made_indicator
		}
	});

	if (!bail) {
		bail = await prisma.bail.create({
			data: {
				first_bail_set_cash: raw.first_bail_set_cash,
				first_bail_set_credit: raw.first_bail_set_credit,
				first_insurance_company_bail_bond: raw.first_insurance_company_bail_bond,
				first_secured_surety_bond: raw.first_secured_surety_bond,
				first_secured_app_bond: raw.first_secured_app_bond,
				first_unsecured_surety_bond: raw.first_unsecured_surety_bond,
				first_unsecured_app_bond: raw.first_unsecured_app_bond,
				first_partially_secured_surety_bond: raw.first_partially_secured_surety_bond,
				partially_secured_surety_bond_perc: raw.partially_secured_surety_bond_perc,
				first_partially_secured_app_bond: raw.first_partially_secured_app_bond,
				partially_secured_app_bond_perc: raw.partially_secured_app_bond_perc,
				bail_made_indicator: raw.bail_made_indicator
			}
		});
	} else {
		bail = await prisma.bail.update({
			where: {
				bail_id: bail.bail_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}

	return bail;
}

export async function findOrCreateArrest(raw: CaseRawType) {
	let arrest = await prisma.arrest.findFirst({
		where: {
			top_arrest_law: raw.top_arrest_law,
			top_arrest_article_section: raw.top_arrest_article_section,
			top_arrest_attempt_indicator: raw.top_arrest_attempt_indicator,
			top_charge_at_arrest: raw.top_charge_at_arrest,
			top_charge_severity_at_arrest: raw.top_charge_severity_at_arrest,
			top_charge_weight_at_arrest: raw.top_charge_weight_at_arrest,
			top_charge_at_arrest_violent_felony_ind: raw.top_charge_at_arrest_violent_felony_ind
		}
	});

	if (!arrest) {
		arrest = await prisma.arrest.create({
			data: {
				top_arrest_law: raw.top_arrest_law,
				top_arrest_article_section: raw.top_arrest_article_section,
				top_arrest_attempt_indicator: raw.top_arrest_attempt_indicator,
				top_charge_at_arrest: raw.top_charge_at_arrest,
				top_charge_severity_at_arrest: raw.top_charge_severity_at_arrest,
				top_charge_weight_at_arrest: raw.top_charge_weight_at_arrest,
				top_charge_at_arrest_violent_felony_ind: raw.top_charge_at_arrest_violent_felony_ind
			}
		});
	} else {
		arrest = await prisma.arrest.update({
			where: {
				arrest_id: arrest.arrest_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}

	return arrest;

}

export async function findOrCreateCounty(raw: CaseRawType) {
	let county = await prisma.county.findFirst({
		where: {
			county_name: raw.county_name
		}
	});

	if (!county) {
		county = await prisma.county.create({
			data: {
				county_name: raw.county_name
			}
		});
	} else {
		await prisma.county.update({
			where: {
				county_id: county.county_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}
	return county;
}

export async function findOrCreateCourt(raw: CaseRawType) {
	let court = await prisma.court.findFirst({
		where: {
			court_ori: raw.court_ori ?? '',
			county_name: raw.county_name ?? '',
			district: raw.district ?? '',
			region: raw.region ?? '',
			court_type: raw.court_type ?? ''
		}
	});

	if (!court) {
		court = await prisma.court.create({
			data: {
				court_name: raw.court_name,
				court_ori: raw.court_ori ?? '',
				county_name: raw.county_name ?? '',
				district: raw.district ?? '',
				region: raw.region ?? '',
				court_type: raw.court_type ?? ''
			}
		});
	}
	return court;
}

export async function findOrCreateDefendant(raw: CaseRawType) {
	let defendant = await prisma.defendant.findFirst({
		where:
			{
				gender: raw.gender || '',
				race: raw.race || '',
				ethnicity: raw.ethnicity || '',
				age_at_crime: raw.age_at_crime || '',
				age_at_arrest: raw.age_at_arrest || ''
			}
	});

	if (!defendant) {
		defendant = await prisma.defendant.create({
			data: {
				gender: raw.gender || '',
				race: raw.race || '',
				ethnicity: raw.ethnicity || '',
				age_at_crime: raw.age_at_crime || '',
				age_at_arrest: raw.age_at_arrest || '',
				case_count: 1
			}
		});
	} else {
		await prisma.defendant.update({
			where: {
				defendant_id: defendant.defendant_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}

	return defendant;
}

export async function findOrCreateJudge(raw: CaseRawType) {
	let judge = await prisma.judge.findFirst({
		where: {
			judge_name: raw.judge_name
		}
	});
	if (!judge) {
		judge = await prisma.judge.create({
			data: {
				judge_name: raw.judge_name,
				// counties: [raw.county_name],
				primary_county: raw.county_name,
				case_count: 1
			}
		});
	} else {
		await prisma.judge.update({
			where: {
				judge_id: judge.judge_id
			},
			data: {
				// counties: {
				// 	push: raw.county_name
				// },
				case_count: {
					increment: 1
				}
			}
		});
	}
	return judge;
}

export async function findOrCreateWarrant(raw: CaseRawType) {
	let warrant = await prisma.warrant.findFirst({
		where: {
			warrant_ordered_btw_arraign_and_dispo: raw.warrant_ordered_btw_arraign_and_dispo,
			dat_wo_ws_prior_to_arraign: raw.dat_wo_ws_prior_to_arraign,
			non_stayed_wo: raw.non_stayed_wo,
			num_of_stayed_wo: raw.num_of_stayed_wo,
			num_of_row: raw.num_of_row
		}
	});
	if (!warrant) {
		warrant = await prisma.warrant.create({
			data: {
				warrant_ordered_btw_arraign_and_dispo: raw.warrant_ordered_btw_arraign_and_dispo,
				dat_wo_ws_prior_to_arraign: raw.dat_wo_ws_prior_to_arraign,
				non_stayed_wo: raw.non_stayed_wo,
				num_of_stayed_wo: raw.num_of_stayed_wo,
				num_of_row: raw.num_of_row
			}
		});
	} else {
		await prisma.warrant.update({
			where: {
				warrant_id: warrant.warrant_id
			},
			data: {
				case_count: {
					increment: 1
				}
			}
		});
	}
	return warrant;
}

