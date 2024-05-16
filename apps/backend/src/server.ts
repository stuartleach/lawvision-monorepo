import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {PrismaClient} from '@shared/prisma';
import {
    processCase,
    saveUnresolvedCitations,
    Context
} from './services/case-citation-processor';

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
        res.status(500).json({error: "Internal Server Error"});
    }
});

app.get('/api/process-citations', async (req: Request, res: Response) => {
    const context: Context = {
        tooManyRequests: true,
        currentDepth: 0,
        recursionLimit: 1,  // Adjust this value for your desired recursion limit
        unresolvedCitations: new Set<string>(),
        requestDelay: 2000 // 2 seconds delay between requests
    };

    try {
        const listOfCases = await prisma.supreme_court_cases.findMany({take: 2});
        await Promise.all(listOfCases.map(caseItem => processCase(caseItem, context)));

        // Save unresolved citations to a file
        await saveUnresolvedCitations(context.unresolvedCitations);

        res.status(200).send('Server utils job completed successfully');
    } catch (error: unknown) {
        console.error('Error running server utils job:', error);
        res.status(500).send('Error running server utils job');
    } finally {
        await prisma.$disconnect();
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
