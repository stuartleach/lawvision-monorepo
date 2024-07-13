import { filterBailSetCases, filterReleasedCases, filterRemandedCases } from './caseFilters';
import { prisma } from './prisma_client';
import { bailEligibleWhereClause, races, severities } from './queries/constants';
import { calculatePercentages, percentify } from './queries/utils';


// Judge Data Fetching (Optimized)
const fetchJudgeCases = async (judgeId: string, whereClause?: any) => {
	return prisma.case.findMany({
		where: { Judge: { judge_id: judgeId }, ...(whereClause || {}) },
		select: {
			Bail: { select: { first_bail_set_cash: true } },
			ArraignmentOutcome: { select: { remanded_to_jail_at_arraign: true, ror_at_arraign: true, nmr_at_arraign: true } },
			Defendant: { select: { race: true } },
			ArraignCharge: { select: { top_charge_weight_at_arraign: true } } // For severity calculation
		}
	});
};

export const fetchCountyCases = async (countyId: string, whereClause?: any) => {
	return prisma.case.findMany({
		where: { County: { county_id: countyId }, ...(whereClause || {}) },
		select: {
			Bail: { select: { first_bail_set_cash: true } },
			ArraignmentOutcome: { select: { remanded_to_jail_at_arraign: true, ror_at_arraign: true, nmr_at_arraign: true } },
			Defendant: { select: { race: true } },
			ArraignCharge: { select: { top_charge_weight_at_arraign: true } } // For severity calculation
		}
	});
};

export const fetchJudgesByCounty = async (countyId: string) => {
	return prisma.judge.findMany({
		where: { County: { county_id: countyId } }
	});
};


export const fetchCountyThings = async () => {
	const counties = await fetchAllCounties();
	const countyCases = await Promise.all(counties.map(async county => {
		const cases = await fetchCountyCases(county.county_id, {
			ArraignCharge: { top_charge_weight_at_arraign: { in: severities.slice(0, 1) } },
			ArraignmentOutcome: { remanded_to_jail_at_arraign: { equals: 'Y' } }

		});
		return {
			countyName: county.county_name,
			caseCount: cases.length
		};
	}));

	return countyCases;

};

export const fetchAllCounties = async () => {
	return prisma.county.findMany();
};


const getJudgePercentagesByCaseSeverity = async (judgeId: string) => {
	const judgeCases = await fetchJudgeCases(judgeId, { ArraignCharge: { top_charge_weight_at_arraign: { in: severities } } });

	const calculateSeverityScores = (severity: string) => {
		const cases = judgeCases.filter(c => c.ArraignCharge?.top_charge_weight_at_arraign === severity);
		const calcPercent = (filterFn: (cs: any[]) => any[]) => percentify(filterFn(cases).length / cases.length);

		return {
			bailSet: calcPercent(filterBailSetCases),
			remanded: calcPercent(filterRemandedCases),
			released: calcPercent(filterReleasedCases),
			byRace: races.reduce((acc, race) => ({
				...acc,
				[race]: calculatePercentages(cases, race)
			}), {} as Record<string, any>),
			totalCases: cases.length
		};
	};

	return severities.reduce((acc, severity) => ({
		...acc,
		[severity]: calculateSeverityScores(severity)
	}), {} as Record<string, any>);
};
// Judge Percentages by Race (Optimized)
const getJudgePercentagesByRace = async (judgeId: string) => {
	const judgesCasesWhereBailIsEligible = await fetchJudgeCases(judgeId, bailEligibleWhereClause);
	return races.reduce((acc, race) => ({
		...acc,
		[race]: calculatePercentages(judgesCasesWhereBailIsEligible, race)
	}), {} as Record<string, any>);
};

// Batch Processing (Generalized)
async function getJudgeScoresBatch(judgesBatch: any[], getScoresFn: (judgeId: string) => Promise<any>) {
	return Promise.all(judgesBatch.map(async (judge) => ({
		judgeName: judge.judge_name,
		scores: await getScoresFn(judge.judge_id),
		totalCases: judge.case_count
	})));
}


// Fetch All Judge Scores (Optimized)
export const getAllJudgeRacialScores = async () => {
	const batchSize = 5; // Increased for better performance
	let offset = 0;
	let allJudgeScores: any[] = [];

	while (true) {
		const judgesBatch = await prisma.judge.findMany({
			select: { judge_id: true, judge_name: true, case_count: true },
			where: {
				case_count: { gte: 500 },
				judge_name: { notIn: ['Office, Clerk\'s', 'Judge/JHO/Hearing Examiner, Visiting', 'Judge, TBD'] }
			},
			take: batchSize,
			skip: offset
		});

		if (judgesBatch.length === 0) break;

		const batchScores = await getJudgeScoresBatch(judgesBatch, getJudgePercentagesByCaseSeverity); // Switch between getJudgePercentagesByRace and getJudgePercentagesByCaseSeverity depending on the desired results.
		allJudgeScores = allJudgeScores.concat(batchScores);

		offset += batchSize;
	}

	const sortedJudgeScores = allJudgeScores.sort((a, b) => b.scores.AF.bailSet - a.scores.AF.bailSet).slice(0, 50);

	return {
		data: sortedJudgeScores.map(judge => ({
			judgeName: judge.judgeName,
			totalCases: judge.totalCases,
			scores: judge.scores
		}))
	};
};
