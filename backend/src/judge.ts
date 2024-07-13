import { Case } from '@prisma/client';
import { filterBailSetCases, filterReleasedCases, filterRemandedCases } from './caseFilters';
import { prisma } from './prisma_client';
import { bailEligibleWhereClause, races, severities } from './queries/constants';

export interface CaseSelection {
	Bail: { first_bail_set_cash: number | null };
	ArraignmentOutcome: {
		remanded_to_jail_at_arraign: string | null;
		ror_at_arraign: string | null;
		nmr_at_arraign: string | null;
	};
	Defendant: { race: string | null };
	ArraignCharge: { top_charge_weight_at_arraign: string | null };
}

// Judge Data Fetching (Optimized)
export const fetchJudgeCases = async (judgeId: string, whereClause?: any): Promise<CaseSelection[]> => {
	return prisma.case.findMany({
		where: { Judge: { judge_id: judgeId }, ...(whereClause || {}) },
		select: {
			Bail: { select: { first_bail_set_cash: true } },
			ArraignmentOutcome: { select: { remanded_to_jail_at_arraign: true, ror_at_arraign: true, nmr_at_arraign: true } },
			Defendant: { select: { race: true } },
			ArraignCharge: { select: { top_charge_weight_at_arraign: true } } // For severity calculation
		}
	}) as unknown as CaseSelection[];
};

export const fetchCountyCases = async (countyId: string, whereClause?: any): Promise<CaseSelection[]> => {
	return prisma.case.findMany({
		where: { County: { county_id: countyId }, ...(whereClause || {}) },
		select: {
			Bail: { select: { first_bail_set_cash: true } },
			ArraignmentOutcome: { select: { remanded_to_jail_at_arraign: true, ror_at_arraign: true, nmr_at_arraign: true } },
			Defendant: { select: { race: true } },
			ArraignCharge: { select: { top_charge_weight_at_arraign: true } } // For severity calculation
		}
	}) as unknown as CaseSelection[];
};

type ArraignmentResult = {
	raw: number;
	percent: number;
};

type ArraignmentResults = {
	averageBailAmount: number;
	bailSet: ArraignmentResult;
	remanded: ArraignmentResult;
	released: ArraignmentResult;
	totalCases: number;
};

type CalcResults = {
	byRace: Record<string, ArraignmentResults>;
	total: ArraignmentResults;
};

type ResultsBySeverity = {
	[severity: string]: CalcResults;
};

export type JudgeOrCountyStats = {
	resultsBySeverity: ResultsBySeverity;
	allCaseResults: CalcResults;
};

const calcPercent = (raw: number, total: number): number => (total > 0 ? (raw / total) * 100 : 0);

const calcArraignmentResults = (cases: CaseSelection[]): ArraignmentResults => {
	const bailSet = filterBailSetCases(cases).length;
	const remanded = filterRemandedCases(cases).length;
	const released = filterReleasedCases(cases).length;
	const totalCases = cases.length;

	const casesWithBail = cases.filter(c => c.Bail?.first_bail_set_cash !== null && c.Bail.first_bail_set_cash > 0);
	const totalBailAmount = casesWithBail.reduce((acc, c) => acc + Number(c.Bail?.first_bail_set_cash ?? 0), 0);
	const averageBailAmount = casesWithBail.length > 0 ? totalBailAmount / casesWithBail.length : 0;

	console.log('TOTAL BAIL AMOUNT:', totalBailAmount);
	console.log('AVERAGE BAIL AMOUNT:', averageBailAmount);
	console.log('TOTAL CASES:', totalCases);

	return {
		averageBailAmount,
		bailSet: { raw: bailSet, percent: calcPercent(bailSet, totalCases) },
		remanded: { raw: remanded, percent: calcPercent(remanded, totalCases) },
		released: { raw: released, percent: calcPercent(released, totalCases) },
		totalCases
	};
};

export const calculateStats = async (cases: CaseSelection[]): Promise<JudgeOrCountyStats> => {
	const resultsBySeverity: ResultsBySeverity = {};

	for (let severity of severities) {
		const casesBySeverity = cases.filter(c => c.ArraignCharge?.top_charge_weight_at_arraign === severity);
		const totalResults = calcArraignmentResults(casesBySeverity);

		const resultsByRace = races.reduce((acc, race) => {
			const casesByRace = casesBySeverity.filter(c => c.Defendant?.race === race);
			acc[race] = calcArraignmentResults(casesByRace);
			return acc;
		}, {} as Record<string, ArraignmentResults>);

		resultsBySeverity[severity] = {
			byRace: resultsByRace,
			total: totalResults
		};
	}

	const allCasesTotalResults = calcArraignmentResults(cases);
	const allCasesResultsByRace = races.reduce((acc, race) => {
		const casesByRace = cases.filter(c => c.Defendant?.race === race);
		acc[race] = calcArraignmentResults(casesByRace);
		return acc;
	}, {} as Record<string, ArraignmentResults>);

	const allCaseResults: CalcResults = {
		byRace: allCasesResultsByRace,
		total: allCasesTotalResults
	};

	return {
		resultsBySeverity,
		allCaseResults
	};
};

export const fetchAllCounties = async () => {
	return prisma.county.findMany();
};
