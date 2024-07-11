import { PrismaClient } from '@prisma/client';
import {
	clearTables,
	findOrCreateAppearance,
	findOrCreateArraignCharge,
	findOrCreateArrest,
	findOrCreateBail,
	findOrCreateCalculatedDays,
	findOrCreateCondition,
	findOrCreateConviction,
	findOrCreateCounty,
	findOrCreateCourt,
	findOrCreateDefendant,
	findOrCreateDisposition,
	findOrCreateJudge,
	findOrCreatePrior,
	findOrCreateWarrant,
	getRawCases,
	createCaseDetails,
	findOrCreateArraignmentOutcome,
	findOrCreateRepresentation, RAW_CASE_BATCH_SIZE
} from './hydrateTables/migrateEach';

const prisma = new PrismaClient();


export async function migrateData() {
	try {
		await clearTables();
		let offset = 0;
		let rawCases = [];

		do {
			rawCases = await getRawCases(offset, RAW_CASE_BATCH_SIZE);
			if (rawCases.length === 0) break;

			for (const raw of rawCases) {
				let appearance = await findOrCreateAppearance(raw);
				let arraignCharge = await findOrCreateArraignCharge(raw);
				let arrest = await findOrCreateArrest(raw);
				let bail = await findOrCreateBail(raw);
				let calculatedDays = await findOrCreateCalculatedDays(raw);
				let condition = await findOrCreateCondition(raw);
				let conviction = await findOrCreateConviction(raw);
				let county = await findOrCreateCounty(raw);
				let court = await findOrCreateCourt(raw);
				let defendant = await findOrCreateDefendant(raw);
				let judge = await findOrCreateJudge(raw);
				let prior = await findOrCreatePrior(raw);
				let warrant = await findOrCreateWarrant(raw);
				let disposition = await findOrCreateDisposition(raw);
				let representation = await findOrCreateRepresentation(raw);
				let arraignmentOutcome = await findOrCreateArraignmentOutcome(raw);
				let date = await createCaseDetails(raw);

				await prisma.case.create({
					data: {
						internal_case_id: raw.internal_case_id,
						case_type: raw.case_type,
						Conviction: { connect: { conviction_id: conviction.conviction_id } },
						Court: { connect: { court_id: court.court_id } },
						Judge: { connect: { judge_id: judge.judge_id } },
						County: { connect: { county_id: county.county_id } },
						Defendant: { connect: { defendant_id: defendant.defendant_id } },
						Appearance: { connect: { appearance_id: appearance.appearance_id } },
						Conditions: { connect: { condition_id: condition.condition_id } },
						Bail: { connect: { bail_id: bail.bail_id } },
						Warrant: { connect: { warrant_id: warrant.warrant_id } },
						Disposition: { connect: { disposition_id: disposition.disposition_id } },
						CalculatedDays: { connect: { calculated_days_id: calculatedDays.calculated_days_id } },
						Arrest: { connect: { arrest_id: arrest.arrest_id } },
						Prior: { connect: { prior_id: prior.prior_id } },
						Representation: { connect: { representation_id: representation.representation_id } },
						ArraignmentOutcome: { connect: { arraignment_outcome_id: arraignmentOutcome.arraignment_outcome_id } },
						Date: { connect: { date_id: date.date_id } },
						ArraignCharge: { connect: { arraign_charge_id: arraignCharge.arraign_charge_id } }
					}
				});
			}

			offset += RAW_CASE_BATCH_SIZE;
			console.log(`Processed batch starting at offset: ${offset}`);

		} while (rawCases.length === RAW_CASE_BATCH_SIZE);

		console.log('Migration completed successfully');
	} catch (e) {
		console.error('Migration failed', e);
	}
}
