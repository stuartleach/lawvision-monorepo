import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {PrismaClient} from '@prisma/client';

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
                    // average_bail_amount: 'desc'
                    race_importance: 'desc'
                }, take: numJudges
            })
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
            const results = await prisma.counties.findMany({
                orderBy: {
                    average_bail_amount: 'desc'
                }, take: numCounties
            })
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
