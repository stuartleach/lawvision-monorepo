import { Request, Response, Router } from 'express';
import {
	fetchJudgeCases,
	calculateStats, JudgeOrCountyStats
} from '../judge';
import { prisma } from '../prisma_client';

const judgesRouter = Router();


type BasicJudgeInfo = {
	judge_id: string;
	judge_name: string;
	county_id: string;
	county_name: string;

}


judgesRouter.get('/', async (req: Request, res: Response) => {
	const numJudges = parseInt(req.query.limit as string) || 100; // Default to 100 judges
	const countyId = req.query.county_id as string || '';

	// const judges = await getAllJudgeRacialScores();
	// const judges = await fetchAllCounties()
	// const result = await fetchCountyThings();
	// return res.json(result);
});


// judgesRouter.get('/:judge_id', async (req, res) => {
// 	const judgeId = req.params.judge_id;
// 	const judge = await getAllJudgeRacialScores(judgeId);
//
// 	if (!judge) {
// 		res.status(500).json({ error: 'Internal Server Error' });
// 		return;
// 	}
//
// 	return res.json(judge);
// });


judgesRouter.get('/judges_stats', async (req, res) => {

	const judges = await prisma.judge.findMany({
		select: {
			judge_id: true,
			judge_name: true,
			primary_county: true,
		}
	});

	let stats: any[] = [];

	for (let judge of judges) {
		const cases = await fetchJudgeCases(judge.judge_id);
		let judgeStats = await calculateStats(cases);
		stats.push({
			judge_id: judge.judge_id,
			judge_name: judge.judge_name,
			county_name: judge.primary_county,
			...judgeStats
		});
	}


	return res.json(stats);

});


//
// judgesRouter.get('/:judge_id/race_outcomes', async (req, res) => {
// 	const judgeId = req.params.judge_id;
// 	try {
// 		// const raceOutcomes = await getNumberOfCasesOfEachRace({ judgeName: countyName });
// 		const raceOutcomes = await getCombinedPreTrialOutcomes({ judgeId: judgeId });
// 		return res.json(raceOutcomes);
// 	} catch (error) {
// 		console.error;
// 		return res.status(500).json({ error: 'Internal Server Error' });
// 	}
// });
//
// judgesRouter.get('/:judge_id/arraignment_statistics', async (req, res) => {
// 	const judgeId = req.params.judge_id;
// 	try {
// 		const chargeOutcomes = await getArraignmentStatistics(judgeId);
// 		return res.json(chargeOutcomes);
// 	} catch (error) {
// 		console.error;
// 		return res.status(500).json({ error: 'Internal Server Error' });
// 	}
// })
//
//
// judgesRouter.get('/:judge_id/bail_statistics', async (req, res) => {
// 	const judgeId = req.params.judge_id;
// 	try {
// 		const chargeOutcomes = await getBailStatistics(judgeId);
// 		return res.json(chargeOutcomes);
// 	} catch (error) {
// 		console.error;
// 		return res.status(500).json({ error: 'Internal Server Error' });
// 	}
// })
//
// judgesRouter.get('/:judge_id/outcomes', async (req, res) => {
// 	const judgeId = req.params.judge_id;
// 	try {
// 		// const raceOutcomes = await getNumberOfCasesOfEachRace({ judgeName: countyName });
// 		const pretrialOutcomes = await getPretrialOutcomesForJudge({ judgeId: judgeId });
// 		console.log('pretrialOutcomes', pretrialOutcomes);
// 		return res.json(pretrialOutcomes);
// 	} catch (error) {
// 		console.error;
// 		return res.status(500).json({ error: 'Internal Server Error' });
// 	}
// });


export default judgesRouter;
