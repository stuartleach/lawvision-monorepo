import { Router } from 'express';
import { prisma } from '../prisma_client';
import { calculateStats, fetchJudgeCases } from '../utils';

const judgesRouter = Router();

judgesRouter.get('/judges_stats', async (req, res) => {

	const judges = await prisma.judge.findMany({
		select: {
			judge_id: true,
			judge_name: true,
			primary_county: true
		}
	});

	let stats: any[] = [];

	for (let judge of judges) {
		const cases = await fetchJudgeCases(judge.judge_id);
		let judgeStats = await calculateStats(cases);
		stats.push({
			judgeId: judge.judge_id,
			name: judge.judge_name,
			primaryCounty: judge.primary_county,
			...judgeStats
		});
	}
	return res.json(stats);
});
export default judgesRouter;
