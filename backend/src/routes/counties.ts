import { Router } from 'express';
import { calculateStats, fetchCountyCases, fetchJudgeCases } from '../judge';
import { prisma } from '../prisma_client';
import { getCounties, getPreTrialOutcomesForEachChargeWeight } from '../queries';
import { getCombinedPreTrialOutcomes } from '../queries/complexQueries';
import judgesRouter from './judges';

const countiesRouter = Router();


countiesRouter.get('/', async (req, res) => {
	try {
		const results = await getCounties();
		res.json(results);
	} catch (error) {
		console.error('Error fetching counties:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

countiesRouter.get('/:county_name/race_outcomes', async (req, res) => {
	const countyName = req.params.county_name;
	try {
		// const raceOutcomes = await getNumberOfCasesOfEachRace({ countyName: countyName });
		const raceOutcomes = await getCombinedPreTrialOutcomes({ countyName: countyName });
		return res.json(raceOutcomes);
	} catch (error) {
		console.error;
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

countiesRouter.get('/:county_name/charges', async (req, res) => {
	const countyName = req.params.county_name;
	try {
		const charges = await getPreTrialOutcomesForEachChargeWeight({ countyName: countyName });
		return res.json(charges);
	} catch (error) {
		console.error;
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

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
			county_id: county.county_id,
			county_name: county.county_name,
			...countyStats
		});
	}
	return res.json(stats);
});


export default countiesRouter;
