import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { GetFindResult } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client/extension';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});

app.get('/api/counties', async (req: Request, res: Response) => {

		const numCounties = parseInt(req.query.limit as string) || 10000; // Default to 10 cases
		try {
			const results = await prisma.counties.findMany({
				orderBy: {
					average_bail_set: 'desc'
				}, take: numCounties
			});
			res.json(results);
		} catch
			(error) {
			console.error('Error fetching counties:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}

	}
);

app.get('/api/top_judges_by_county', async (req: Request, res: Response) => {
	const numJudges = parseInt(req.query.limit as string) || 10; // Default to 10 cases
	let countyQuery = req.query.county as string;
	const county = countyQuery.toString().slice(0, 1).toUpperCase() + countyQuery.toString().slice(1);

	if (!county) {
		res.status(400).json({ error: 'Missing county parameter' });
		return;
	}

	let results: any;

	try {
		results = await prisma.judges.findMany({
			where: {
				judge_name: {
					notIn: ['Office, Clerk\'s', 'Judge/JHO/Hearing Examiner, Visiting', 'Judge, TBD']
				},
				counties: {
					has: county
				}
			},
			// orderBy: {
			// 	average_bail_set: 'desc'
			// },
			take: numJudges
		});
		// if bail set is null, set it to 0
		results = results.map((judge: { average_bail_set: number | null; }) => {
			if (judge.average_bail_set === null) {
				judge.average_bail_set = 0;
			}
			return judge;
		});
		res.json(results);
	} catch (error) {
		console.error('Error fetching judges:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.get('/api/top_judges', async (req: Request, res: Response) => {
	const numJudges = parseInt(req.query.limit as string) || 100; // Default to 10 cases

	let results: any;

	try {
		results = await prisma.judges.findMany({
			where: {
				judge_name: {
					notIn: ['Office, Clerk\'s', 'Judge/JHO/Hearing Examiner, Visiting', 'Judge, TBD']
				}
			},
			take: numJudges
		});
		// if bail set is null, set it to 0
		results = results.map((judge: { average_bail_set: number | null; }) => {
			if (judge.average_bail_set === null) {
				judge.average_bail_set = 0;
			}
			return judge;
		});
		res.json(results);
	} catch (error) {
		console.error('Error fetching judges:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
