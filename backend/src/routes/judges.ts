import { Request, Response, Router } from 'express';
import { getJudges } from '../queries';
import { getCombinedPreTrialOutcomes } from '../queries/complexQueries';
import countiesRouter from './counties';

const judgesRouter = Router();

judgesRouter.get('/', async (req: Request, res: Response) => {
	const numJudges = parseInt(req.query.limit as string) || 100; // Default to 100 judges
	const countyId = req.query.county_id as string || '';

	const judges = await getJudges(countyId, numJudges);

	if (!judges) {
		res.status(500).json({ error: 'Internal Server Error' });
		return;
	}

	res.json(judges);
});

judgesRouter.get('/:judge_id/race_outcomes', async (req, res) => {
	const judgeId = req.params.judge_id;
	try {
		// const raceOutcomes = await getNumberOfCasesOfEachRace({ judgeName: countyName });
		const raceOutcomes = await getCombinedPreTrialOutcomes({ judgeId: judgeId });
		return res.json(raceOutcomes);
	} catch (error) {
		console.error;
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});


export default judgesRouter;
