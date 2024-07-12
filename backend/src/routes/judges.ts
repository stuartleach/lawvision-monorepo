import { Request, Response, Router } from 'express';
import { getAllJudgeRacialScores } from '../queries/slimQueries';
// // import { getJudges } from '../queries';
// import { getCombinedPreTrialOutcomes, getPretrialOutcomesForJudge } from '../queries/complexQueries';
// import { getArraignmentStatistics, getBailStatistics } from '../queries/baseQueries';
// import { getJudges } from '../queries/slimQueries';

const judgesRouter = Router();

judgesRouter.get('/', async (req: Request, res: Response) => {
	const numJudges = parseInt(req.query.limit as string) || 100; // Default to 100 judges
	const countyId = req.query.county_id as string || '';

	const judges = await getAllJudgeRacialScores()


	if (!judges) {
		res.status(500).json({ error: 'Internal Server Error' });
		return;
	}

	res.json(judges);
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
