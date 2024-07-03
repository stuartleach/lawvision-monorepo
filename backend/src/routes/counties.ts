import { Router } from 'express';
import { getCounties, getPreTrialOutcomesForEachChargeWeight } from '../queries';
import { getCombinedPreTrialOutcomes } from '../queries/complexQueries';

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


export default countiesRouter;
