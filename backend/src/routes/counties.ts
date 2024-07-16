import { Router } from 'express';
import { calculateStats, fetchCountyCases } from '../judge';
import { prisma } from '../prisma_client';
// import getCounties from '../queries/getCounties';


const countiesRouter = Router();

//
// countiesRouter.get('/', async (req, res) => {
// 	try {
// 		const results = await getCounties();
// 		res.json(results);
// 	} catch (error) {
// 		console.error('Error fetching counties:', error);
// 		res.status(500).json({ error: 'Internal Server Error' });
// 	}
// });

countiesRouter.get('/counties_stats', async (req, res) => {

	const counties = await prisma.county.findMany({
		select: {
			county_id: true,
			county_name: true
		}
	});

	let stats: any[] = [];

	for (let county of counties) {
		const cases = await fetchCountyCases(county.county_id);
		let countyStats = await calculateStats(cases);
		stats.push({
			countyId: county.county_id,
			name: county.county_name,
			...countyStats
		});
	}
	return res.json(stats);
});




export default countiesRouter;
