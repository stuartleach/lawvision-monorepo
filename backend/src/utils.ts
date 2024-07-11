import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function hydrateArraignmentStatistics() {
	// Delete all rows from arraignment_statistics
	await prisma.arraignmentStatistics.deleteMany({});

	// Define the combinations of stat_type and severity
	const statTypes = [
		'remand_at_arraign',
		'ror_at_arraign',
		'nmr_at_arraign',
		'release_at_arraign',
		'bail_set_at_arraign',
		'unknown_at_arraign'
	];

	const severities = [
		'AF', 'BF', 'CF', 'DF', 'EF', 'AM', 'BM'
	];

	const races = [
		'Black', 'American Indian/Alaskan Native', 'Asian/Pacific Islander',
		'Other', 'White', 'Unknown'
	];

	// Insert empty rows into arraignment_statistics
	const judges = await prisma.judge.findMany({ select: { judge_id: true } });

	const inserts = [];
	for (const judge of judges) {
		for (const statType of statTypes) {
			for (const severity of severities) {
				for (const race of races) {
					inserts.push({
						judge_id: judge.judge_id,
						stat_type: statType,
						severity: severity,
						race: race
					});
				}
			}
		}
	}

	await prisma.arraignmentStatistics.createMany({
		data: inserts
	});

	async function updateArraignmentStatistics(statType: string, condition: any, severity: string) {

		// Execute queries and get results directly
		const totalCases = await prisma.cases.groupBy({
			by: ['judge_id', 'race'],
			where: {
				top_charge_weight_at_arraign: severity,
				judge_id: { not: null }
			},
			_count: {
				_all: true
			}
		});

		const matchedCases = await prisma.cases.groupBy({
			by: ['judge_id', 'race'],
			where: {
				top_charge_weight_at_arraign: severity,
				judge_id: { not: null },
				AND: [condition]
			},
			_count: {
				_all: true
			}
		});

		// Log the results
		console.log(`Total Cases Results for severity ${severity}:`, totalCases);
		console.log(`Matched Cases Results for severity ${severity} and condition ${statType}:`, matchedCases);
		

		console.log(`Total Cases Results for severity ${severity}:`, totalCases);
		console.log(`Matched Cases Results for severity ${severity} and condition ${statType}:`, matchedCases);


		for (const matchedCase of matchedCases) {
			const totalCaseForJudgeRace = totalCases.find(tc =>
				tc.judge_id === matchedCase.judge_id &&
				tc.race === matchedCase.race
			);

			const total_count = totalCaseForJudgeRace?._count?._all ?? 0; // Default to 0 if not found
			const matched_count = matchedCase._count._all; // Count of cases with the specific outcome

			const percentage = total_count === 0 ? 0 : (matched_count * 100) / total_count;

			await prisma.arraignmentStatistics.updateMany({
				where: {
					judge_id: matchedCase.judge_id,
					stat_type: statType,
					severity: severity,
					race: matchedCase.race
				},
				data: {
					count: matched_count,  // Store the count of matched cases
					percentage: percentage
				}
			});
		}
	}

	const conditions = {
		remand_at_arraign: { remanded_to_jail_at_arraign: true }, // Check if boolean
		bail_set_at_arraign: { release_decision_at_arraign: 'Bail-set' },
		ror_at_arraign: { ror_at_arraign: true }, // Check if boolean
		nmr_at_arraign: { nmr_at_arraign: true }, // Check if boolean
		release_at_arraign: {
			OR: [
				{ nmr_at_arraign: true }, // Check if boolean
				{ ror_at_arraign: true } // Check if boolean
			]
		},
		unknown_at_arraign: { release_decision_at_arraign: 'Unknown' }
	};

	for (const [statType, condition] of Object.entries(conditions)) {
		for (const severity of severities) {
			await updateArraignmentStatistics(statType, condition, severity);
		}
	}
}
