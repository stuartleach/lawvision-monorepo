import { Request, Response, Router } from 'express';
import { prisma } from '../prisma_client';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const numJudges = parseInt(req.query.limit as string) || 100; // Default to 100 judges
	const countyId = req.query.county_id as string;


});

export default router;
