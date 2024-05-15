import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@shared/prisma';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/api/cases', async (req: Request, res: Response) => {
    try {
        const numCases = parseInt(req.query.numCases as string) || 10; // Default to 10 cases
        const cases = await prisma.supreme_court_cases.findMany({
            take: numCases, // Fetch the specified number of cases
            select: { // Only select these fields
                cases_citations: true,
                name: true,
                citation: true,
            }
        });
        res.json(cases);
    } catch (error) {
        console.error("Error fetching cases:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
