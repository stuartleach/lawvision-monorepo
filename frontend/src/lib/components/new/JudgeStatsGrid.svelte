<script lang="ts">
	import type { County, Judge } from '$lib/types';
	import JudgeStatItem from './JudgeStatItem.svelte';

	export let selectedJudgeInfo: Judge | null;
	export let county: County | undefined;
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
					<div class="grid grid-cols-1 items-stretch gap-px sm:grid-cols-2 lg:grid-cols-5 ">
<!--						<div class="px-4 py-6 sm:px-6 lg:px-8">-->
							<JudgeStatItem label="Total Cases" value={stats?.caseCount || 0}
														 percentileCounty={stats?.pctileCounty?.caseCount || 0}
														 percentileState={stats?.pctileState?.caseCount || 0}
														 {hoveredStat} {handleMouseEnter} {handleMouseLeave} />
<!--						</div>-->
<!--						<div class="px-4 py-6 sm:px-6 lg:px-8">-->
							<JudgeStatItem label="Average Bail Amount"
														 value={hoveredStat === 'amount' ? stats?.totalBailSet : stats?.averageBailSet}
														 isMoney={true}
														 percentileCounty={stats?.pctileCounty?.bailAmount || 0}
														 percentileState={stats?.pctileState?.bailAmount || 0}
														 {hoveredStat} {handleMouseEnter} {handleMouseLeave} />
<!--						</div>-->
<!--						<div class="px-4 py-6 sm:px-6 lg:px-8">-->
							<JudgeStatItem label="Bail Set Frequency" value={stats?.pct?.bailSet || 0}
														 isHoverable={true}
														 percentileCounty={stats?.pctileCounty?.bailSet || 0}
														 percentileState={stats?.pctileState?.bailSet || 0}
														 {hoveredStat} {handleMouseEnter} {handleMouseLeave} />
<!--						</div>-->
<!--						<div class="px-4 py-6 sm:px-6 lg:px-8">-->
							<JudgeStatItem label="Remand Frequency" value={stats?.pct?.remand || 0}
														 isHoverable={true}
														 percentileCounty={stats?.pctileCounty?.remand || 0}
														 percentileState={stats?.pctileState?.remand || 0}
														 {hoveredStat} {handleMouseEnter} {handleMouseLeave} />

<!--						</div>-->
<!--						<div class="py-4 py-6 sm:px-6 lg:px-8">-->
							<JudgeStatItem label="Release Frequency" value={stats?.pct?.release || 0}
														 isHoverable={true}
														 percentileCounty={stats?.pctileCounty?.release || 0}
														 percentileState={stats?.pctileState?.release || 0}
														 {hoveredStat} {handleMouseEnter} {handleMouseLeave} />
<!--						</div>-->
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
