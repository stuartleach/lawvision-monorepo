<script lang="ts">
	import JudgeGridItem from '$lib/components/judge-focus/JudgeGridItem.svelte';
	import JudgeStatItem from '$lib/components/judge-focus/JudgeStatItem.svelte';

	import type { Judge } from '$lib/types';

	export let selectedJudgeInfo: Judge | null;
	export let hoveredStat: string | null;
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;

	let chargeSeverities = ['A Felony', 'B Felony', 'C Felony', 'D Felony', 'E Felony', 'Misdemeanor', 'Infraction'];

	$: stats = selectedJudgeInfo?.stats;
</script>

<!--<div class="text-zinc-200 p-8 h-screen">-->
<div class="flex flex-col">
	<h2 class="text-zinc-50 tracking-tight text-4xl m-8">Breakdown by Charge</h2>
	<div class="flex flex-row justify-center">
		<div class="bg-zinc-900">
			<div class="mx-auto max-w-7xl">
				{#if selectedJudgeInfo}
					{#each chargeSeverities as c}
						<div class="grid w-full"><h3 class="mx-2 text-zinc-200 bg-zinc-950/50 rounded-t-3xl text-left pl-10 py-2 pt-6 w-full text-2xl mt-6 mb-0.5 tracking-tighter">{c}
						</h3>
							<div
								class="grid grid-cols-2 w-full rounded-none gap-x-0.5 sm:gap-x-0.5 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-4">
								<JudgeGridItem
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
								<JudgeGridItem
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
								<JudgeGridItem
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

								<JudgeGridItem
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
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

<!--</div>-->
