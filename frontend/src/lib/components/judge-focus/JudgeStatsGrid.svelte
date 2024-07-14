<script lang="ts">
	import { allJudgesStore, selectedJudgeStore, severityLabels } from '$lib/stores/data';
	import type { ResultsBySeverity } from '$lib/types/frontendTypes';
	import { formatNumber, getValue } from '$lib/utils';
	import JudgeStatItem from './JudgeStatItem.svelte';

	export let severity: keyof ResultsBySeverity = 'Any';

	let label = severityLabels[severity] || 'All Charges';

	$: allJudges = $allJudgesStore;

	$: console.log(allJudges.find(j => j.name === 'Gershuny, Jeffrey A.'));


</script>

<div class="flex flex-col">
	<!-- JudgeStatsGrid -->
	<div class="flex flex-row justify-center">
		<div class="bg-zinc-900">
			<div class="mx-auto max-w-7xl">
				{#if $selectedJudgeStore}
					<div class="grid w-full">
						<div
							class="flex flex-row justify-between mx-2 text-zinc-200 bg-zinc-950/50 rounded-t-3xl text-left px-10 py-2 pt-6 w-full text-2xl mt-6 mb-0.5 tracking-tighter">
							<h3
								class="flex">
								{label}
							</h3>
							<h2 class="flex flex-row justify-between align-text-bottom">
								<!--								<span-->
								<!--									class="totalCases-color font-mono font-bold pr-1">{formatNumber(getValue($selectedJudgeStore, 'totalCases', severity))}</span>-->
								<!--								<span class="text-base">cases</span>-->
							</h2>
						</div>
						<div class="grid grid-cols-2 w-full rounded-md gap-x-0.5 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-5">
							<JudgeStatItem
								{severity}
								metric="averageBailAmount"
								value={getValue($selectedJudgeStore, 'averageBailAmount', severity)}
							/>
							<JudgeStatItem
								{severity}
								metric="bailSet"
								value={getValue($selectedJudgeStore, 'bailSet', severity)}

							/>
							<JudgeStatItem
								{severity}
								metric="remanded"
								value={getValue($selectedJudgeStore, 'remanded', severity)}
							/>
							<JudgeStatItem
								{severity}
								metric="released"
								value={getValue($selectedJudgeStore, 'released', severity)}
							/>
							<JudgeStatItem
								{severity}
								metric="totalCases"
								value={getValue($selectedJudgeStore, 'totalCases', severity)}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
