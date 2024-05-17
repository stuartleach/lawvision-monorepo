import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@shared/prisma';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

interface Node {
    id: string;
    name: string;
    term: string;
}

interface Edge {
    source: string;
    target: string | null;
    citation: string;
}

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/api/cases', async (req: Request, res: Response) => {
    try {
        const numCases = parseInt(req.query.numCases as string) || 10; // Default to 10 cases

        // Fetch cases
        const cases = await prisma.supreme_court_cases.findMany({
            take: numCases,
            select: {
                id: true,
                name: true,
                term: true
            }
        });

        const caseIds = cases.map(c => c.id);

        // Fetch case citations that are relevant to the fetched cases
        const caseCitations = await prisma.cases_citations.findMany({
            where: {
                self_id: { in: caseIds }
            },
            select: {
                self_id: true,
                target_uuid: true,
                target_citation: true
            }
        });

        // Transform cases to nodes
        const nodes: Node[] = cases.map(c => ({
            id: c.id,
            name: c.name || 'Unknown Case',
            term: c.term || 'Unknown Term'
        }));

        // Transform case citations to edges
        const edges: Edge[] = caseCitations.map(c => ({
            source: c.self_id,
            target: c.target_uuid,
            citation: c.target_citation || 'Unknown Citation'
        }));

        res.json({ nodes, edges });
    } catch (error) {
        console.error("Error fetching cases:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
