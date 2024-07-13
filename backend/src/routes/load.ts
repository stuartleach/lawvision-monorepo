import { Router, Request, Response } from 'express';
import { migrateData } from '../migrateData';
import { prisma } from '../prisma_client';

const loadRouter = Router();

interface CountyInfo {
	county_name: string;
	number_of_cases: number;
}

interface Judge {
	judge_id: string;
	judge_name: string;
	counties: CountyInfo[];
	primary_county: string | null;
}

loadRouter.get('/populate_judge_county_info', async (req: Request, res: Response) => {
	// for each judge, set the "primary county" to the county where they have the most cases
	const judges = await prisma.judge.findMany();
	for (let judge of judges) {

		// first, clear the counties column to reset from square one
		await prisma.judge.update({
			where: {
				judge_id: judge.judge_id
			},
			data: {
				counties: []
			}
		});

		const cases = await prisma.caseRaw.findMany({
			where: {
				judge_name: judge.judge_name
			}
		});

		// Initialize counties array if it doesn't exist
		let counties: CountyInfo[] = judge.counties as never as CountyInfo[] || [];

		// Create a map to count cases per county
		const countyCounts: { [county_name: string]: number } = counties.reduce((acc, curr) => {
			// @ts-ignore
			acc[curr.county_name] = curr.number_of_cases;
			return acc;
		}, {});

		// Populate countyCounts object with case counts
		cases.forEach((c) => {
			countyCounts[c.county_name as never as string] = (countyCounts[c.county_name as never as string] || 0) + 1;
		});

		// Convert countyCounts back to CountyInfo array
		counties = Object.keys(countyCounts).map((county_name) => ({
			county_name,
			number_of_cases: countyCounts[county_name]
		}));

		// Determine primary county
		const primaryCounty = counties.reduce((prev, curr) =>
			prev.number_of_cases > curr.number_of_cases ? prev : curr
		).county_name;

		// Update judge record
		await prisma.judge.update({
			where: {
				judge_id: judge.judge_id
			},
			data: {
				counties: counties as never as string[], // FIXME: This is a hack to get around TS type checking
				primary_county: primaryCounty
			}
		});
	}

	res.send('Populated judge county info.');
});

loadRouter.get('/set_primary_county', async (req: Request, res: Response) => {
	const judges = await prisma.judge.findMany();

	for (let judge of judges) {
		// 	the highest count of counties is the primary county
		const counties = judge.counties as never as CountyInfo[];

		// if there are no counties, skip this judge
		if (counties.length === 0) {
			continue;
		}

		console.log(counties);
		const primaryCounty = counties.reduce((prev, curr) =>
			prev.number_of_cases > curr.number_of_cases ? prev : curr
		).county_name;

		await prisma.judge.update({
			where: {
				judge_id: judge.judge_id
			},
			data: {
				primary_county: primaryCounty
			}
		});
	}

	res.send('Set primary county for all judges.');
});

loadRouter.get('/health', async (req: Request, res: Response) => {
	res.send('Health check passed.').status(200);
});

loadRouter.get('/migrate_all_data', async (req: Request, res: Response) => {
	console.log('Beginning data migration.');
	await migrateData().then(() => {
		console.log('Migrated data.');
	});

	res.send('Data migration complete.');
});


export default loadRouter;
