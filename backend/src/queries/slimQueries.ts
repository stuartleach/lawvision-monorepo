import { prisma } from '../prisma_client';

const capitalize = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();

export const getJudges = async (countyId?: string, numJudges: number = 100) => {
	return getTop10JudgesWithHighestRemandPercentage();
};

interface CaseWithOutcome {
	judge_id: string;
	ArraignmentOutcome?: {
		remanded_to_jail_at_arraign?: string;
	};
}

interface JudgeStats {
	totalCases: number;
	remandedCases: number;
}

let whereClause = {

	ArraignCharge: {
		top_charge_weight_at_arraign: {
			in: ['AF', 'BF']
		},
		top_charge_at_arraign_violent_felony_ind: 'N',
		// hate_crime_ind: 'N',
		// arraign_charge_category: {
		// 	not: 'Rape'
		// }
	},
	Prior: {
		prior_vfo_cnt: '0',
		prior_nonvfo_cnt: '0',
		pend_vfo: '0'
	},
	// County: {
	// 	county_name: {
	// 		contains: 'Kings'
	// 	}
	// },
	Defendant: {
		race: 'Black'
	},
	Judge: {
		case_count: {
			gte: 1000
		}
	}

};


async function getTop10JudgesWithHighestRemandPercentage() {
	const cases: any[] = await prisma.case.findMany({
		where: whereClause,
		select: {
			judge_id: true,
			ArraignmentOutcome: {
				select: {
					remanded_to_jail_at_arraign: true
				}
			}
		}
	});

	// console.log(cases.slice(0,10))

	const judgeStats: Record<string, JudgeStats> = cases.reduce((acc, curr) => {
		const judgeId = curr.judge_id;
		if (!acc[judgeId]) {
			acc[judgeId] = {
				totalCases: 0,
				remandedCases: 0
			};
		}
		acc[judgeId].totalCases++;
		if (curr.ArraignmentOutcome?.remanded_to_jail_at_arraign === 'Y') {
			acc[judgeId].remandedCases++;
		}
		return acc;
	}, {} as Record<string, JudgeStats>);

	const judgeRemandPercentages = Object.entries(judgeStats).map(([judgeId, stats]) => ({
		judgeId,
		remandPercentage: stats.totalCases > 0 ? (stats.remandedCases / stats.totalCases) * 100 : 0
	}));

	const top10JudgesWithHighestRemandPercentage = judgeRemandPercentages
		.sort((a, b) => b.remandPercentage - a.remandPercentage)
		.slice(0, 100);

	const judgeDetails = await prisma.judge.findMany({
		where: {
			judge_id: {
				in: top10JudgesWithHighestRemandPercentage.map(judge => judge.judgeId)
			}
		},
		select: {
			judge_id: true,
			judge_name: true,
			_count: {
				select: {
					cases: {
						where: {
							ArraignmentOutcome: {
								remanded_to_jail_at_arraign: 'Y'
							}
						}
					}
				}
			}
		}
	});

	const result = top10JudgesWithHighestRemandPercentage.map(judge => {
			const judgeDetail = judgeDetails.find(detail => detail.judge_id === judge.judgeId);
			return {
				judge_name: judgeDetail?.judge_name || 'Unknown',
				remandPercentage: judge.remandPercentage,
				count: judgeDetail?._count.cases || 0
			};
		}).filter(judge => judge?.count > 10)
	;

	console.log('Top 10 Judges with the highest remand percentage:', result);
	return result;
}

getJudges().catch(e => {
	throw e;
}).finally(async () => {
	await prisma.$disconnect();
});
