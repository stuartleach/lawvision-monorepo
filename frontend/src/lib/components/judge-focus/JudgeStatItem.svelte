<script lang="ts">
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import { selectedJudgeStore, severityLabels } from '$lib/stores/data';
	import type {
		ArraignmentResults,
		BailSet, Race,
		SeverityLevel
	} from '$lib/types/frontendTypes';
	import { formatNumber, formatPercent, getValue } from '$lib/utils';

	export let isMoney = false;
	export let metric: keyof ArraignmentResults | 'averageBailAmount' = 'bailSet';

	export let severity: SeverityLevel = 'Any';

	export let value: number = $selectedJudgeStore ? getValue($selectedJudgeStore, metric, severity, 'Any', false) : 0;

	let label = severityLabels[severity] || 'All Charges';

	const races: Race[] = ['Any', 'White', 'Black', 'American Indian/Alaska Native', 'Asian/Pacific Islander', 'Other', 'Unknown'];
	const raceLabels: Record<Race, string> = {
		Any: 'All',
		White: 'White',
		Black: 'Black',
		'American Indian/Alaska Native': 'American Indian',
		'Asian/Pacific Islander': 'Asian',
		Other: 'Other',
		Unknown: 'Unknown'
	};

	const hoverKey = label.toLowerCase().replace(/ /g, '');


</script>

<div
	class="mx-2 grid grid-rows-2 sm:rounded-none sm:first:rounded-bl-2xl last:rounded-br-2xl [&:nth-last-child(2)]:rounded-bl-2xl sm:[&:nth-last-child(2)]:rounded-none bg-zinc-950/50 w-full justify-center px-6 py-6 sm:px-6 lg:px-8">
	<!--JudgeStatItem-->
	<div class="border-b border-dotted border-zinc-700 w-full text-center text-white/50">
		<p class="text-sm font-medium leading-6">{label}</p>
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

	<div class="rank font-sans text-sm tracking-tight text-zinc-400 px-4">
		<div class="flex-col border-zinc-700 pt-2">
			<div class="text-right flex flex-col">

				{#each races as race}
					<div class="flex flex-row justify-between w-48 px-2">
						<span class="flex text-sm text-zinc-400 tracking-tighter">{raceLabels[race]}</span>
						<div class="flex font-mono text-zinc-300">
							{#if isMoney}
								<span class="text-green-600">
									<Money value={$selectedJudgeStore ? getValue($selectedJudgeStore, metric, severity, race): 0} />
								</span>
							{:else}
								<span>
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
