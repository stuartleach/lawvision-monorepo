import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import countiesRoutes from './routes/counties';
import casesRoutes from './routes/cases';
import judgesRoutes from './routes/judges';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/api/counties', countiesRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/judges', judgesRoutes);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
