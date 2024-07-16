import { Request, Response, Router } from 'express';
import { calculateStats, fetchAllCases } from '../judge';

const casesRouter = Router();

casesRouter.get('/cases_stats', async (req: Request, res: Response) => {

	let cases = await fetchAllCases();
	let stateStats = await calculateStats(cases);
	return res.json({
		name: 'State',
		...stateStats
	})
});


export default casesRouter;
