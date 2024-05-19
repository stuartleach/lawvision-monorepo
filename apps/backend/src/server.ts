import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {PrismaClient} from '@shared/prisma';
import {Node, Edge, GraphData} from '../../frontend/src/types/types'; // Import shared types

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

        // Fetch the most cited cases
        const mostCitedCases = await prisma.cases_citations.groupBy({
            by: ['target_uuid'],
            _count: {
                target_uuid: true,
            },
            orderBy: {
                _count: {
                    target_uuid: 'desc',
                },
            },
            take: numCases,
        });

        const mostCitedCaseIds = mostCitedCases.map(c => c.target_uuid).filter(id => id !== null) as string[];

        // Fetch the cases that cite the most other cases
        const casesThatCiteMost = await prisma.cases_citations.groupBy({
            by: ['self_id'],
            _count: {
                self_id: true,
            },
            orderBy: {
                _count: {
                    self_id: 'desc',
                },
            },
            take: numCases,
        });

        const casesThatCiteMostIds = casesThatCiteMost.map(c => c.self_id).filter(id => id !== null) as string[];

        // Combine the results and remove duplicates
        const combinedCaseIds = Array.from(new Set([...mostCitedCaseIds, ...casesThatCiteMostIds]));

        // Fetch the details of the combined cases
        const uniqueCases = await prisma.supreme_court_cases.findMany({
            where: {
                id: {in: combinedCaseIds},
            },
            select: {
                id: true,
                name: true,
                term: true,
            },
        });

        // Create a set of valid case IDs for easy lookup
        const validCaseIds = new Set(uniqueCases.map(c => c.id));

        // Fetch case citations that are relevant to the fetched cases
        const caseCitations = await prisma.cases_citations.findMany({
            where: {
                OR: [
                    {self_id: {in: combinedCaseIds}},
                    {target_uuid: {in: combinedCaseIds}},
                ],
            },
            select: {
                self_id: true,
                target_uuid: true,
                target_citation: true,
            },
        });

        // Filter valid edges where both source and target nodes exist
        const validEdges = caseCitations.filter(c => c.self_id && c.target_uuid && validCaseIds.has(c.self_id) && validCaseIds.has(c.target_uuid));

        // Calculate weights based on valid incoming edges
        const weights = validEdges.reduce((acc, cur) => {
            if (cur.target_uuid) {
                acc[cur.target_uuid] = (acc[cur.target_uuid] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        // Transform cases to nodes with weights
        const nodes: Node[] = uniqueCases.map(c => ({
            id: c.id,
            name: c.name || 'Unknown Case',
            term: c.term || 'Unknown Term',
            weight: weights[c.id] || 0
        }));

        // Transform valid case citations to edges
        const edges: Edge[] = validEdges.map(c => ({
            source: c.self_id!,
            target: c.target_uuid!,
            citation: c.target_citation || 'Unknown Citation',
        })) as unknown as Edge[];

        const graphData: GraphData = {nodes, edges};

        res.json(graphData);
    } catch (error) {
        console.error("Error fetching cases:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
