import { Request, Response, Router } from 'express';
import { prisma } from '../prisma_client';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const judgeId = req.query.judge_id as string;
    const countyId = req.query.county_id as string;
    const numCases = parseInt(req.query.limit as string) || 100; // Default to 100 cases

    try {
        let whereClause = {};

        if (judgeId && countyId) {
            whereClause = {
                judge_id: judgeId,
                county_id: countyId
            };
        } else if (judgeId) {
            whereClause = { judge_id: judgeId };
        } else if (countyId) {
            whereClause = { county_id: countyId };
        }

        const results = await prisma.cases.findMany({
            where: whereClause,
            take: numCases
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
