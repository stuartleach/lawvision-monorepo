import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import { countiesRouter, casesRouter, judgesRouter } from './routes';


const app: Express = express();

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});

app.use('/api/counties', countiesRouter);
app.use('/api/cases', casesRouter);
app.use('/api/judges', judgesRouter);

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
