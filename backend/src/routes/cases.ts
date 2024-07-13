import { Request, Response, Router } from 'express';
import { getCaseByCaseId, getCases } from '../queries';

const casesRouter = Router();

casesRouter.get('/', async (req: Request, res: Response) => {
	const judgeId = req.query.judge_id as string;
	const countyId = req.query.county_id as string;
	const numCases = parseInt(req.query.limit as string) || 100; // Default to 100 cases

	const cases = await getCases({ countyId, judgeId, numCases });

	if (!cases) {
		res.status(500).json({ error: 'Internal Server Error' });
		return;
	}

	return res.json(cases);
});

casesRouter.get('/:caseId', async (req, res) => {
	const caseId = req.params.caseId;
	try {
		const caseData = await getCaseByCaseId(caseId);
		return res.json(caseData);
	} catch (error) {
		console.error('Error fetching case by id:', error);
		return null;
	}
});

export default casesRouter;
