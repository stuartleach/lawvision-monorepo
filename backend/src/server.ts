import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {PrismaClient} from '@prisma/client';
import {Node, Edge, GraphData} from 'shared/src/types';
import {Decimal} from "@prisma/client/runtime/library"; // Import shared types

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/api/judges', async (req: Request, res: Response) => {

        const numJudges = parseInt(req.query.limit as string) || 10000; // Default to 10 cases

        try {
            const results = await prisma.results.findMany({
                where: {
                    average_bail_amount: {
                        gt: 1
                    },
                    model_target_type: 'judge_name'
                }, orderBy: {
                    average_bail_amount: 'desc'
                }, take: numJudges
            })

            console.log(results)


            res.json(results);
        } catch
            (error) {
            console.error("Error fetching judges:", error);
            res.status(500).json({error: "Internal Server Error"});
        }

    }
)


app.get('/api/counties', async (req: Request, res: Response) => {

        const numCounties = parseInt(req.query.limit as string) || 10000; // Default to 10 cases

        try {
            const results = await prisma.results.findMany({
                where: {
                    average_bail_amount: {
                        gt: 1
                    },
                    model_target_type: 'county_name'
                }, orderBy: {
                    average_bail_amount: 'desc'
                }, take: numCounties
            })


            console.log(results)

            res.json(results);
        } catch
            (error) {
            console.error("Error fetching counties:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
)


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
