<script lang="ts">
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import { selectedJudgeStore, severityLabels } from '$lib/stores/data';
	import type { ArraignmentResults, Race, SeverityLevel } from '$lib/types/frontendTypes';
	import { formatNumber, getValue } from '$lib/utils';

	export let metric: keyof ArraignmentResults | 'averageBailAmount' = 'bailSet';

	export let severity: SeverityLevel = 'Any';

	export let value: number = $selectedJudgeStore ? getValue($selectedJudgeStore, metric, severity, 'Any', false) : 0;

	let label = severityLabels[severity] || 'All Charges';

	const races: Race[] = ['Any', 'White', 'Black', 'American Indian/Alaskan Native', 'Asian/Pacific Islander', 'Other', 'Unknown'];
	const raceLabels: Record<Race, string> = {
		Any: 'All',
		White: 'White',
		Black: 'Black',
		'American Indian/Alaskan Native': 'American Indian',
		'Asian/Pacific Islander': 'Asian',
		Other: 'Other',
		Unknown: 'Unknown'
	};

	const metricLabels: Record<keyof ArraignmentResults | 'averageBailAmount', string> = {
		bailSet: 'Bail Set',
		remanded: 'Remanded',
		released: 'Released',
		averageBailAmount: 'Average Bail Amount',
		totalCases: 'Total Cases'
	};

	const hoverKey = label.toLowerCase().replace(/ /g, '');


</script>

<div
	class="mx-2 grid grid-rows-1 sm:rounded-none sm:first:rounded-bl-2xl last:rounded-br-2xl [&:nth-last-child(2)]:rounded-bl-2xl sm:[&:nth-last-child(2)]:rounded-none bg-zinc-950/50 w-full justify-center px-6 py-6 sm:px-6 lg:px-8">
	<!--JudgeStatItem-->
	<div class="border-b border-dotted border-zinc-700 h-full w-full text-center text-white/50">
		<p class="text-sm font-medium leading-6">{metricLabels[metric]}</p>
		<p class="w-full rounded px-4 py-3">
			<span class="text-4xl font-semibold tracking-tight -mx-4 px-4 {metric}-color">

				{#if metric === 'averageBailAmount'}
					<span class="averageBail-color">
						<Money {value} />
					</span>
				{:else if metric === 'totalCases'}
					<span class="totalCases-color-color">
						{formatNumber(value)}
					</span>
					{:else}
					<span class="{metric}-color">
						<Percent {value} /></span>
				{/if}
			</span>
		</p>
	</div>

	<div class="text-sm tracking-tight text-zinc-400 px-4">
		<div class="flex-col pt-2">
			<div class="text-right flex flex-col">
				{#each races.slice(1, races.length) as race}
					<div class="flex flex-row justify-between w-48 px-2">
						<span class="flex text-sm text-zinc-400 tracking-tighter">{raceLabels[race]}</span>
						<div class="flex font-mono text-zinc-300">
							{#if metric === 'averageBailAmount'}
								<span class="{metric}-color">
									<Money value={$selectedJudgeStore ? getValue($selectedJudgeStore, metric, severity, race): 0} />
								</span>
							{:else if metric === 'totalCases'}
								<span class="text-blue-500">
									{formatNumber($selectedJudgeStore ? getValue($selectedJudgeStore, metric, severity, race) : 0)}</span>
							{:else}
								<span class="{metric}-color">
									<Percent value={$selectedJudgeStore ? getValue($selectedJudgeStore, metric, severity, race): 0} />
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
