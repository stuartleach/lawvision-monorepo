import express, { Express, Request, Response } from 'express';
import { migrateData } from '../prisma/migrateData';
import { PORT } from './config';
import { /*countiesRouter, casesRouter, */judgesRouter } from './routes';
import { hydrateArraignmentStatistics } from './utils';


const app: Express = express();

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});
//
// app.use('/api/counties', countiesRouter);
// app.use('/api/cases', casesRouter);
app.use('/api/judges', judgesRouter);

// hydrateArraignmentStatistics().then(() => {
// 	console.log('Hydrated arraignment statistics');
// });

// (async ()=> {
// 	console.log("Beginning data migration.")
// 	migrateData().then(() => {
// 	console.log('Migrated data.');
// })})();

app.get('/migrate', async (req: Request, res: Response) => {
	console.log('Beginning data migration.');
	await migrateData();
	console.log('Migrated data.');
	res.send('Migrated data.');
});

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
