import { prisma } from '../prisma_client';
import { QueryOptions } from './queryTypes';

// Helper function to handle capitalization of county names
const capitalize = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();

// Utility functions to get IDs and names
const getJudgeIdByJudgeName = async (judgeName: string) => {
	try {
		const judge = await prisma.judges.findUnique({ where: { judge_name: judgeName } });
		return judge ? judge.judge_id : null;
	} catch (error) {
		console.error('Error fetching judge id by name:', error);
		return null;
	}
};

const getCountyIdByCountyName = async (countyName: string) => {
	try {
		const county = await prisma.counties.findUnique({ where: { county_name: capitalize(countyName) } });
		return county ? county.county_id : null;
	} catch (error) {
		console.error('Error fetching county id by name:', error);
		return null;
	}
};

const getCountyNameByCountyId = async (countyId: string) => {
	try {
		const county = await prisma.counties.findUnique({ where: { county_id: countyId } });
		return county ? county.county_name : null;
	} catch (error) {
		console.error('Error fetching county name by id:', error);
		return null;
	}
};

// Core functions
const getCases = async (query: QueryOptions) => {
	const { countyId, countyName, judgeId, judgeName, numCases } = query;
	try {
		const whereClause: any = {};
		if (judgeId) whereClause.judge_id = judgeId;
		if (countyId) whereClause.county_id = countyId;
		if (judgeName) whereClause.judge_id = await getJudgeIdByJudgeName(judgeName);
		if (countyName) whereClause.county_id = await getCountyIdByCountyName(countyName);

		console.log('whereClause:', whereClause);

		return await prisma.cases.findMany({
			where: whereClause,
			take: numCases
		});
	} catch (error) {
		console.error('Error fetching cases:', error);
		return [];
	}
};

const getChargeSeverityByCaseId = async (caseId: string) => {
	try {
		const result = await prisma.cases.findUnique({
			where: {
				case_id: caseId
			},
			select: {
				top_charge_weight_at_arraign: true
			}
		});
		return result;
	} catch (error) {
		console.error('Error fetching charge severity by case id:', error);
		return null;
	}
};

const getCaseByCaseId = async (caseId: string) => {
	try {
		return await prisma.cases.findUnique({ where: { case_id: caseId } });
	} catch (error) {
		console.error('Error fetching case by id:', error);
		return null;
	}
};

const getJudges = async (countyId: string = '', numJudges: number = 100) => {
	try {
		const baseWhereClause = {
			judge_name: {
				notIn: ['Office, Clerk\'s', 'Judge/JHO/Hearing Examiner, Visiting', 'Judge, TBD']
			}
		};

		if (!countyId) {
			return await prisma.judges.findMany({
				where: baseWhereClause,
				take: numJudges
			});
		}

		const countyName = await getCountyNameByCountyId(countyId);
		if (!countyName) return [];

		return await prisma.judges.findMany({
			where: {
				...baseWhereClause,
				counties: {
					has: countyName
				}
			},
			take: numJudges
		});
	} catch (error) {
		console.error('Error fetching judges:', error);
		return [];
	}
};

const getCounties = async () => {
	try {
		return await prisma.counties.findMany({
			orderBy: { average_bail_set: 'desc' }
		});
	} catch (error) {
		console.error('Error fetching counties:', error);
		return [];
	}
};

const getCountyByName = async (countyName: string) => {
	try {
		const county = await prisma.counties.findUnique({ where: { county_name: capitalize(countyName) } });
		return county || `No county found for name ${countyName}`;
	} catch (error) {
		console.error('Error fetching county by name:', error);
		return `No county found for name ${countyName}`;
	}
};

const getCountyById = async (countyId: string) => {
	try {
		const county = await prisma.counties.findUnique({ where: { county_id: countyId } });
		return county || null;
	} catch (error) {
		console.error('Error fetching county by id:', error);
		return `No county found for id ${countyId}`;
	}
};

const getJudgeByName = async (judgeName: string) => {
	try {
		const judge = await prisma.judges.findUnique({ where: { judge_name: judgeName } });
		return judge || `No judge found for name ${judgeName}`;
	} catch (error) {
		console.error('Error fetching judge by name:', error);
		return `No judge found for name ${judgeName}`;
	}
};

const getJudgeById = async (judgeId: string) => {
	try {
		const judge = await prisma.judges.findUnique({ where: { judge_id: judgeId } });
		return judge || null;
	} catch (error) {
		console.error('Error fetching judge by id:', error);
		return `No judge found for id ${judgeId}`;
	}
};

const getJudgeNameByJudgeId = async (judgeId: string) => {
	try {
		const judge = await prisma.judges.findUnique({ where: { judge_id: judgeId } });
		return judge ? judge.judge_name : `No judge name found for id ${judgeId}`;
	} catch (error) {
		console.error('Error fetching judge name by id:', error);
		return `No judge name found for id ${judgeId}`;
	}
};

const getPretrialOutcome = async (caseId: string): Promise<'bail' | 'release' | 'remand' | 'unknown'> => {
	try {
		const courtCase = await getCaseByCaseId(caseId);
		if (!courtCase) {
			return 'unknown';
		}
		if (courtCase.first_bail_set_cash && Number(courtCase.first_bail_set_cash) > 0) {
			return 'bail';
		} else if (courtCase.remanded_to_jail_at_arraign === 'Y') {
			return 'remand';
		} else if (courtCase.ror_at_arraign === 'Y' || courtCase.nmr_at_arraign === 'Y') {
			return 'release';
		}
		return 'unknown';
	} catch (error) {
		console.error('Error fetching pretrial outcome by case id:', error);
		return 'unknown';
	}
};

export {
	getCases,
	getCounties,
	getCaseByCaseId,
	getJudges,
	getCountyIdByCountyName,
	getCountyNameByCountyId,
	getChargeSeverityByCaseId,
	getJudgeByName,
	getJudgeById,
	getCountyByName,
	getCountyById,
	getJudgeIdByJudgeName,
	getJudgeNameByJudgeId,
	getPretrialOutcome
};
