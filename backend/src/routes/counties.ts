import { Router } from 'express';
import { prisma } from '../prisma_client';

const router = Router();


router.get('/', async (req, res) => {
	try {
		const results = await prisma.counties.findMany({
			orderBy: { average_bail_set: 'desc' }
		});
		res.json(results);
	} catch (error) {
		console.error('Error fetching counties:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.get('/:countyId/race_outcomes', async (req, res) => {
	const countyId = req.params.countyId;
//     for each race in cases belonging to the county,
	//    get the number of cases with the
	//
});

export default router;
