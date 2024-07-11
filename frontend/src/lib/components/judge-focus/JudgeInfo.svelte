<script lang="ts">
	import JudgeGridItem from '$lib/components/judge-focus/JudgeGridItem.svelte';
	import JudgeStatItem from '$lib/components/judge-focus/JudgeStatItem.svelte';
	import { selectedJudgeArraignmentStatisticsStore, selectedJudgeBailStatisticsStore } from '$lib/stores/data';

	import type { Judge } from '$lib/types';

	export let selectedJudgeInfo: Judge | null;


	$: selectedJudgeArraignmentStatistics = $selectedJudgeArraignmentStatisticsStore;
	$: selectedJudgeBailStatistics = $selectedJudgeBailStatisticsStore;

	export let hoveredStat: string | null;
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;

	$: charges = [
		{
			label: 'A Felony',
			arraignmentStats: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'AF'),
			bailStats: selectedJudgeBailStatistics?.filter(x => x.severity === 'AF'),
			averageBailAmount: selectedJudgeBailStatistics?.filter(x => x.severity === 'AF')[0]?.average_bail_set,
			bailSet: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'AF' && x.stat_type === 'bail_set_at_arraign')[0],
			remand: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'AF' && x.stat_type === 'remand_at_arraign')[0],
			release: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'AF' && x.stat_type === 'release_at_arraign')[0]

		},
		{
			label: 'B Felony',
			arraignmentStats: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'BF'),
			bailStats: selectedJudgeBailStatistics?.filter(x => x.severity === 'BF'),
			averageBailAmount: selectedJudgeBailStatistics?.filter(x => x.severity === 'BF')[0]?.average_bail_set,
			bailSet: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'BF' && x.stat_type === 'bail_set_at_arraign')[0],
			remand: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'BF' && x.stat_type === 'remand_at_arraign')[0],
			release: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'BF' && x.stat_type === 'release_at_arraign')[0]
		},
		{
			label: 'C Felony',
			arraignmentStats: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'CF'),
			bailStats: selectedJudgeBailStatistics?.filter(x => x.severity === 'CF'),
			averageBailAmount: selectedJudgeBailStatistics?.filter(x => x.severity === 'CF')[0]?.average_bail_set,
			bailSet: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'CF' && x.stat_type === 'bail_set_at_arraign')[0],
			remand: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'CF' && x.stat_type === 'remand_at_arraign')[0],
			release: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'CF' && x.stat_type === 'release_at_arraign')[0]
		},
		{
			label: 'D Felony',
			arraignmentStats: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'DF'),
			bailStats: selectedJudgeBailStatistics?.filter(x => x.severity === 'DF'),
			averageBailAmount: selectedJudgeBailStatistics?.filter(x => x.severity === 'DF')[0]?.average_bail_set,
			bailSet: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'DF' && x.stat_type === 'bail_set_at_arraign')[0],
			remand: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'DF' && x.stat_type === 'remand_at_arraign')[0],
			release: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'DF' && x.stat_type === 'release_at_arraign')[0]
		},
		{
			label: 'E Felony',
			arraignmentStats: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'EF'),
			bailStats: selectedJudgeBailStatistics?.filter(x => x.severity === 'EF'),
			averageBailAmount: selectedJudgeBailStatistics?.filter(x => x.severity === 'EF')[0]?.average_bail_set,
			bailSet: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'EF' && x.stat_type === 'bail_set_at_arraign')[0],
			remand: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'EF' && x.stat_type === 'remand_at_arraign')[0],
			release: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'EF' && x.stat_type === 'release_at_arraign')[0]
		},
		{
			label: 'A Misdemeanor',
			arraignmentStats: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'AM'),
			bailStats: selectedJudgeBailStatistics?.filter(x => x.severity === 'AM'),
			averageBailAmount: selectedJudgeBailStatistics?.filter(x => x.severity === 'AM')[0]?.average_bail_set,
			bailSet: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'AM' && x.stat_type === 'bail_set_at_arraign')[0],
			remand: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'AM' && x.stat_type === 'remand_at_arraign')[0],
			release: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'AM' && x.stat_type === 'release_at_arraign')[0]
		},
		{
			label: 'B Misdemeanor',
			arraignmentStats: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'BM'),
			bailStats: selectedJudgeBailStatistics?.filter(x => x.severity === 'BM'),
			averageBailAmount: selectedJudgeBailStatistics?.filter(x => x.severity === 'BM')[0]?.average_bail_set,
			bailSet: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'BM' && x.stat_type === 'bail_set_at_arraign')[0],
			remand: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'BM' && x.stat_type === 'remand_at_arraign')[0],
			release: selectedJudgeArraignmentStatistics?.filter(x => x.severity === 'BM' && x.stat_type === 'release_at_arraign')[0]
		}
	];

	$: console.log(charges);

	$: stats = selectedJudgeInfo?.stats;
</script>

<div class="flex flex-col">
	<h2 class="text-zinc-50 tracking-tight text-4xl m-8">Breakdown by Charge</h2>
	<div class="flex flex-row justify-center">
		<div class="bg-zinc-900">
			<div class="mx-auto max-w-7xl">
				{#if selectedJudgeArraignmentStatistics}
					{#each charges as charge}
						<div class="grid w-full"><h3
							class="mx-2 text-zinc-200 bg-zinc-950/50 rounded-t-3xl text-left pl-10 py-2 pt-6 w-full text-2xl mt-6 mb-0.5 tracking-tighter">{charge.label}
						</h3>
							<div
								class="grid grid-cols-2 w-full rounded-none gap-x-0.5 sm:gap-x-0.5 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-4">
								<JudgeGridItem
									label="Average Bail Amount"
									metric="averageBail"
									value={charge?.averageBailAmount || 0}
									isMoney={true}
									percentileCounty={stats?.pctileCounty?.bailAmount || 0}
									percentileState={stats?.pctileState?.bailAmount || 0}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
								<JudgeGridItem
									label="Bail Set Frequency"
									metric="bailSet"
									value={ charge?.bailSet?.percentage || 0}
									isHoverable={true}
									percentileCounty={stats?.pctileCounty?.bailSet || 0}
									percentileState={stats?.pctileState?.bailSet || 0}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
								<JudgeGridItem
									label="Remand Frequency"
									metric="remand"
									value={charge?.remand?.percentage || 0}
									isHoverable={true}
									percentileCounty={stats?.pctileCounty?.remand || 0}
									percentileState={stats?.pctileState?.remand || 0}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>

								<JudgeGridItem
									label="Release Frequency"
									metric="release"
									value={charge?.release?.percentage || 0}
									isHoverable={true}
									percentileCounty={stats?.pctileCounty?.release || 0}
									percentileState={stats?.pctileState?.release || 0}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

<!--</div>-->
