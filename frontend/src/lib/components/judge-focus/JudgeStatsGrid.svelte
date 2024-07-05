<script lang="ts">
	import type { Judge } from '$lib/types';
	import JudgeStatItem from './JudgeStatItem.svelte';

	export let selectedJudgeInfo: Judge | null;
	export let hoveredStat: string | null;
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;

	$: stats = selectedJudgeInfo?.stats;
</script>

<div class="flex flex-col">
	<div class="flex flex-row justify-center">
		<div class="bg-zinc-900">
			<div class="mx-auto max-w-7xl">
				{#if selectedJudgeInfo}
					<div class="grid grid-cols-1 items-stretch gap-px sm:grid-cols-2 lg:grid-cols-5">
						<JudgeStatItem
							label="Total Cases"
							metric="caseCount"
							value={stats?.caseCount || 0}
							percentileCounty={stats?.pctileCounty?.caseCount || 0}
							percentileState={stats?.pctileState?.caseCount || 0}
							{hoveredStat}
							{handleMouseEnter}
							{handleMouseLeave}
						/>
						<JudgeStatItem
							label="Average Bail Amount"
							metric="averageBail"
							value={hoveredStat === 'amount' ? stats?.totalBailSet : stats?.averageBailSet}
							isMoney={true}
							percentileCounty={stats?.pctileCounty?.bailAmount || 0}
							percentileState={stats?.pctileState?.bailAmount || 0}
							{hoveredStat}
							{handleMouseEnter}
							{handleMouseLeave}
						/>
						<JudgeStatItem
							label="Bail Set Frequency"
							metric="bailSet"
							value={stats?.pct?.bailSet || 0}
							isHoverable={true}
							percentileCounty={stats?.pctileCounty?.bailSet || 0}
							percentileState={stats?.pctileState?.bailSet || 0}
							{hoveredStat}
							{handleMouseEnter}
							{handleMouseLeave}
						/>
						<JudgeStatItem
							label="Remand Frequency"
							metric="remand"
							value={stats?.pct?.remand || 0}
							isHoverable={true}
							percentileCounty={stats?.pctileCounty?.remand || 0}
							percentileState={stats?.pctileState?.remand || 0}
							{hoveredStat}
							{handleMouseEnter}
							{handleMouseLeave}
						/>

						<JudgeStatItem
							label="Release Frequency"
							metric="release"
							value={stats?.pct?.release || 0}
							isHoverable={true}
							percentileCounty={stats?.pctileCounty?.release || 0}
							percentileState={stats?.pctileState?.release || 0}
							{hoveredStat}
							{handleMouseEnter}
							{handleMouseLeave}
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
