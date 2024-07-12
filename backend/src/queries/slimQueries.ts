import { prisma } from '../prisma_client';
import { bailEligibleCases, races } from './constants';

const bailEligibleWhereClause = bailEligibleCases.felonies.map(article => ({
    ArraignCharge: {
        top_charge_at_arraign: {
            contains: article
        }
    }
}));

const raceFilter = (listOfCases: any[], raceName: string) => {
    return listOfCases.filter(c => c.Defendant?.race === raceName);
};

const raceNotFilter = (listOfCases: any[], raceName: string) => {
    return listOfCases.filter(c => c.Defendant?.race !== raceName);
};

const getBailSetCases = (cs: any[]) => {
    return cs.filter(c => c.Bail && Number(c.Bail?.first_bail_set_cash) > 1);
};

const getRemandedCases = (cs: any[]) => {
    return cs.filter(c => c.ArraignmentOutcome?.remanded_to_jail_at_arraign === 'Y');
};

const getReleasedCases = (cs: any[]) => {
    return cs.filter(c => (c.ArraignmentOutcome?.ror_at_arraign === 'Y' || c.ArraignmentOutcome?.nmr_at_arraign === 'Y'));
};

const getJudgeRacialScore = async (judgeId: string, judgeName: string) => {
    const judgesCasesWhereBailIsEligible = await prisma.case.findMany({
        where: {
            OR: bailEligibleWhereClause,
            Judge: {
                judge_id: judgeId
            }
        },
        select: {
            Bail: {
                select: {
                    first_bail_set_cash: true
                }
            },
            ArraignmentOutcome: {
                select: {
                    remanded_to_jail_at_arraign: true,
                    ror_at_arraign: true,
                    nmr_at_arraign: true
                }
            },
            Defendant: {
                select: {
                    race: true
                }
            },
            ArraignCharge: {
                select: {
                    top_charge_at_arraign: true
                }
            }
        }
    });

    const percentify = (num: number) => Math.round(num * 100);

    const calculatePercentages = (cases: any[], race: string) => {
        const filteredCases = raceFilter(cases, race);
        const notFilteredCases = raceNotFilter(cases, race);

        const percentBailSet = percentify(getBailSetCases(filteredCases).length / filteredCases.length);
        const percentBailSetNot = percentify(getBailSetCases(notFilteredCases).length / notFilteredCases.length);

        const percentRemanded = percentify(getRemandedCases(filteredCases).length / filteredCases.length);
        const percentRemandedNot = percentify(getRemandedCases(notFilteredCases).length / notFilteredCases.length);

        const percentReleased = percentify(getReleasedCases(filteredCases).length / filteredCases.length);
        const percentReleasedNot = percentify(getReleasedCases(notFilteredCases).length / notFilteredCases.length);

        return {
            message: `Racial scores for ${judgeName}:`,
            totalBailEligibleCases: cases.length,
            bailSet: percentBailSet - percentBailSetNot,
            remanded: percentRemanded - percentRemandedNot,
            released: percentReleased - percentReleasedNot
        };
    };

    return races.reduce((acc, race) => {
        acc[race] = calculatePercentages(judgesCasesWhereBailIsEligible, race);
        return acc;
    }, {} as Record<string, any>);
};

const getJudgeRacialScoresBatch = async (judgesBatch: any[]) => {
    return await Promise.all(judgesBatch.map(async (judge) => {
        return {
            judgeName: judge.judge_name,
            scores: await getJudgeRacialScore(judge.judge_id, judge.judge_name),
            totalCases: judge.case_count
        };
    }));
};

export const getAllJudgeRacialScores = async () => {
    const batchSize = 30;  // Adjust batch size as needed
    let offset = 0;
    let allJudgeScores: any[] = [];

    while (true) {
        const judgesBatch = await prisma.judge.findMany({
            select: {
                judge_id: true,
                judge_name: true,
                case_count: true
            },
            where: {
                case_count: {
                    gte: 100
                },
                judge_name: {
                    notIn: ["Office, Clerk's", 'Judge/JHO/Hearing Examiner, Visiting', 'Judge, TBD']
                }
            },
            take: batchSize,
            skip: offset
        });

        if (judgesBatch.length === 0) break;

        const batchScores = await getJudgeRacialScoresBatch(judgesBatch);
        allJudgeScores = allJudgeScores.concat(batchScores);

        offset += batchSize;
    }

    const sortedJudgeScores = allJudgeScores.sort((a, b) => {
        return b.scores.Black.bailSet - a.scores.Black.bailSet;
    }).slice(0, 10);

    sortedJudgeScores.forEach(judge => {
        console.log(`Out of ${judge.scores.Black.totalBailEligibleCases} bail eligible cases:`);
        console.log(`Judge ${judge.judgeName} sets bail on average ${judge.scores.Black.bailSet}% more often for Black defendants than for non-Black defendants.`);
        console.log(`Judge ${judge.judgeName} remands Black defendants to jail on average ${judge.scores.Black.remanded}% more often than non-Black defendants.`);
        console.log(`Judge ${judge.judgeName} releases Black defendants on average ${judge.scores.Black.released}% more often than non-Black defendants.\n`);
    });

    return sortedJudgeScores;
};

getAllJudgeRacialScores().catch(e => {
    throw e;
}).finally(async () => {
    await prisma.$disconnect();
});
