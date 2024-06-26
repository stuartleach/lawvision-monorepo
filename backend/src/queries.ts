import { prisma } from './prisma_client';

import type { Prisma, PrismaClient } from '@prisma/client';

type ModelNames = Prisma.ModelName; // "User" | "Post"

export type PrismaModels = {
	[M in ModelNames]: Exclude<
		Awaited<ReturnType<PrismaClient[Uncapitalize<M>]['findUnique']>>,
		null
	>;
};

const test: PrismaModels['counties'] = {
	county_uuid: '123',
	county_name: 'test',
	average_bail_set: (2.22 as unknown as Prisma.Decimal),
	case_count: 2,
	median_income: 2,
	cases_bail_set: 2,
	cases_remand: 2,
	cases_ror: 2,
	cases_nmr: 2,
	cases_unknown: 2,
	median_id: 'laskdj'
};


const getCases = async (countyId: string = '', judgeId: string = '', numCases: number = 100) => {
	try {
		const whereClause: any = {};
		if (judgeId) whereClause.judge_id = judgeId;
		if (countyId) whereClause.county_id = countyId;

		return await prisma.cases.findMany({
			where: whereClause,
			take: numCases
		});
	} catch (error) {
		console.error('Error fetching cases:', error);
		return [];
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

		const county = await getCountyById(countyId);
		const countyName = await getCountyNameByCountyId(countyId);
		if (!county) return [];

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

const getRaceIdByRaceName = async (raceName: string) => {
	try {
		const race = await prisma.races.findUnique({ where: { race: raceName } });
		return race ? race.race_uuid : `No race id found for name ${raceName}`;
	} catch (error) {
		console.error('Error fetching race id by name:', error);
		return `No race id found for name ${raceName}`;
	}
};

const getRaceNameByRaceId = async (raceId: string) => {
	try {
		const race = await prisma.races.findUnique({ where: { race_uuid: raceId } });
		return race ? race.race : `No race name found for id ${raceId}`;
	} catch (error) {
		console.error('Error fetching race name by id:', error);
		return `No race name found for ${raceId}`;
	}
};

const getCountyIdByCountyName = async (countyName: string) => {
	try {
		const county = await prisma.counties.findUnique({ where: { county_name: countyName } });
		return county ? county.county_uuid : `No county id found for name ${countyName}`;
	} catch (error) {
		console.error('Error fetching county id by name:', error);
		return `No county id found for name ${countyName}`;
	}
};

const getCountyNameByCountyId = async (countyId: string) => {
	try {
		const county = await prisma.counties.findUnique({ where: { county_uuid: countyId } });
		return county ? county.county_name : `No county name found for id ${countyId}`;
	} catch (error) {
		console.error('Error fetching county name by id:', error);
		return `No county name found for id ${countyId}`;
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
		const judge = await prisma.judges.findUnique({ where: { judge_uuid: judgeId } });
		return judge || null;
	} catch (error) {
		console.error('Error fetching judge by id:', error);
		return `No judge found for id ${judgeId}`;
	}
};

const getCountyByName = async (countyName: string) => {
	try {
		const county = await prisma.counties.findUnique({ where: { county_name: countyName } });
		return county || `No county found for name ${countyName}`;
	} catch (error) {
		console.error('Error fetching county by name:', error);
		return `No county found for name ${countyName}`;
	}
};

const getCountyById = async (countyId: string) => {
	try {
		const county = await prisma.counties.findUnique({ where: { county_uuid: countyId } });
		return county || null;
	} catch (error) {
		console.error('Error fetching county by id:', error);
		return `No county found for id ${countyId}`;
	}
};

const getJudgeIdByJudgeName = async (judgeName: string) => {
	try {
		const judge = await prisma.judges.findUnique({ where: { judge_name: judgeName } });
		return judge ? judge.judge_uuid : `No judge id found for name ${judgeName}`;
	} catch (error) {
		console.error('Error fetching judge id by name:', error);
		return `No judge id found for name ${judgeName}`;
	}
};

const getJudgeNameByJudgeId = async (judgeId: string) => {
	try {
		const judge = await prisma.judges.findUnique({ where: { judge_uuid: judgeId } });
		return judge ? judge.judge_name : `No judge name found for id ${judgeId}`;
	} catch (error) {
		console.error('Error fetching judge name by id:', error);
		return `No judge name found for id ${judgeId}`;
	}
};

const getPretrialOutcome = (court_case: any): 'bail' | 'release' | 'remand' | 'unknown' => {
	if (court_case.first_bail_set_cash && court_case.first_bail_set_cash > 0) {
		return 'bail';
	} else if (court_case.remanded_to_jail_at_arraign === 'Yes') {
		return 'remand';
	} else if (court_case.ror_at_arraign === 'Y' || court_case.nmr_at_arraign === 'Y') {
		return 'release';
	}
	return 'unknown';
};

export {
	getCases,
	getJudges,
	getRaceIdByRaceName,
	getRaceNameByRaceId,
	getCountyIdByCountyName,
	getCountyNameByCountyId,
	getJudgeByName,
	getJudgeById,
	getCountyByName,
	getCountyById,
	getJudgeIdByJudgeName,
	getJudgeNameByJudgeId,
	getPretrialOutcome
};
