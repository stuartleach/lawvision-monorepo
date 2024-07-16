import { filterBailSetCases, filterReleasedCases, filterRemandedCases } from './caseFilters';
import { prisma } from './prisma_client';
import { races, severities } from './queries/constants';

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

export const fetchAllCases = async (): Promise<CaseSelection[]> => {
	const result = await prisma.case.findMany({
		select: {
			Bail: { select: { first_bail_set_cash: true } },
			ArraignmentOutcome: { select: { remanded_to_jail_at_arraign: true, ror_at_arraign: true, nmr_at_arraign: true } },
			Defendant: { select: { race: true } },
			ArraignCharge: { select: { top_charge_weight_at_arraign: true } } // For severity calculation
		}
	}) as unknown as CaseSelection[];
	console.log('Fetched all cases:', result.length);
	return result;
};

type ArraignmentResult = {
	raw: number;
	percent: number;
	amount?: number;
};

type ArraignmentResults = {
	bailSet: ArraignmentResult;
	remanded: ArraignmentResult;
	released: ArraignmentResult;
	totalCases: number;
};

type ResultsByRace = {
	[race: string]: ArraignmentResults;
}

type ResultsBySeverity = {
	[severity: string]: ResultsByRace;
};

export type JudgeOrCountyStats = {
	arraignmentResults: ResultsBySeverity;
};

const calcPercent = (raw: number, total: number): number => (total > 0 ? (raw / total) * 100 : 0);

const calcArraignmentResults = (cases: CaseSelection[]): ArraignmentResults => {
	const bailSetCases = filterBailSetCases(cases);
	const remandedCases = filterRemandedCases(cases);
	const releasedCases = filterReleasedCases(cases);
	const totalCases = cases.length;

	const bailSet = bailSetCases.length;
	const remanded = remandedCases.length;
	const released = releasedCases.length;

	const casesWithBail = bailSetCases.filter(c => c.Bail?.first_bail_set_cash !== null && c.Bail.first_bail_set_cash > 0);
	const totalBailAmount = casesWithBail.reduce((acc, c) => acc + Number(c.Bail?.first_bail_set_cash ?? 0), 0);
	const averageBailAmount = casesWithBail.length > 0 ? totalBailAmount / casesWithBail.length : 0;

	return {
		bailSet: { raw: bailSet, percent: calcPercent(bailSet, totalCases), amount: averageBailAmount },
		remanded: { raw: remanded, percent: calcPercent(remanded, totalCases) },
		released: { raw: released, percent: calcPercent(released, totalCases) },
		totalCases
	};
};

export const calculateStats = async (cases: CaseSelection[]): Promise<JudgeOrCountyStats> => {
	const arraignmentResults: ResultsBySeverity = {};

	console.log('Calculating stats for', cases.length, 'cases');

	// Calculate for each severity and overall (Any)
	for (let severity of [...severities, 'Any']) {
		const casesBySeverity = severity === 'Any' ? cases : cases.filter(c => c.ArraignCharge?.top_charge_weight_at_arraign === severity);
		// const totalResults = calcArraignmentResults(casesBySeverity);
		console.log('Calculating stats for', casesBySeverity.length, 'cases with severity', severity);
		arraignmentResults[severity] = [...races, 'Any'].reduce((acc, race) => {
			console.log('Calculating stats for', casesBySeverity.length, 'cases with severity', severity, 'and race', race);
			const casesByRace = race === 'Any' ? casesBySeverity : casesBySeverity.filter(c => c.Defendant?.race === race);
			acc[race] = calcArraignmentResults(casesByRace);
			return acc;
		}, {} as Record<string, ArraignmentResults>);
	}

	return {
		arraignmentResults
	};
};
