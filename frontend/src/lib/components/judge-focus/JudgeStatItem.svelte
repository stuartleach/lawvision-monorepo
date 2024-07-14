<script lang="ts">
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import { selectedJudgeStore } from '$lib/stores/data';
	import type {
		ArraignmentResults,
		ArraignmentResultsByRace,
		BailSet,
		ResultsBySeverity
	} from '$lib/types/frontendTypes';
	import { formatNumber, formatPercent } from '$lib/utils';

	export let label: string;
	export let value: number = 0;
	export let isHoverable = false;
	export let isMoney = false;
	export let hoveredStat: string | null = null;
	export let metric: keyof ArraignmentResults = 'bailSet';
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;
	export let severity: keyof ResultsBySeverity;

	let raceStats: ArraignmentResultsByRace | undefined;

	raceStats = $selectedJudgeStore?.allCaseResults?.byRace;

	const races = ['White', 'Black', 'American Indian/Alaska Native', 'Asian/Pacific Islander', 'Other', 'Unknown'];
	const raceLabels = {
		White: 'White',
		Black: 'Black',
		'American Indian/Alaska Native': 'American Indian',
		'Asian/Pacific Islander': 'Asian',
		Other: 'Other',
		Unknown: 'Unknown'
	};


	const hoverKey = label.toLowerCase().replace(/ /g, '');

	const severityStats = $selectedJudgeStore?.resultsBySeverity;

	const coerceRace = (s: string): keyof ArraignmentResultsByRace => {
		if (raceStats && s in raceStats) {
			return s as keyof ArraignmentResultsByRace;
		} else {
			return 'Unknown';
		}
	};

	const coerceMetric = (s: string): keyof ArraignmentResults => {
		if (severityStats && s in severityStats) {
			return s as keyof ArraignmentResults;
		} else {
			return 'averageBailAmount';
		}
	};

	const getPercentValue = (race: string, metric: keyof ArraignmentResults): number => {
		const raceStat = raceStats?.[coerceRace(race)];
		const metricValue = raceStat?.[metric];
		return typeof metricValue === 'object' && 'percent' in metricValue ? (metricValue as BailSet).percent : 0;
	};

	const getDollarValue = (race: string, metric: keyof ArraignmentResults): number => {
		const raceStat = raceStats?.[coerceRace(race)];
		const metricValue = raceStat?.[metric];
		return metric === 'averageBailAmount'
			? (metricValue as number) || 0
			: typeof metricValue === 'object' && 'raw' in metricValue
				? (metricValue as BailSet).raw
				: 0;
	};
</script>

<div
	class="mx-2 grid grid-rows-2 sm:rounded-none sm:first:rounded-bl-2xl last:rounded-br-2xl [&:nth-last-child(2)]:rounded-bl-2xl sm:[&:nth-last-child(2)]:rounded-none bg-zinc-950/50 w-full justify-center px-6 py-6 sm:px-6 lg:px-8">
	<!--JudgeStatItem-->
	<div class="border-b border-dotted border-zinc-700 w-full pb-4 text-center text-white/50">
		<p class="text-sm font-medium leading-6">{label}</p>
		<p class="mt-2 w-full rounded px-4 py-3">
			<span class="text-4xl font-semibold tracking-tight -mx-4 px-4 {metric}-color">
				{#if isHoverable}
					<HoverableItem
						on:mouseenter={() => handleMouseEnter(hoverKey)}
						on:mouseleave={handleMouseLeave}
						targetBool={hoveredStat === hoverKey}
						valueWhenNotHovered={formatPercent(value) + '%'}
						valueWhenHovered={formatNumber(value)}
					/>
				{:else if isMoney}
					<span class="averageBail-color">
					<Money {value} />
						</span>
				{:else}
					<span class:remanded-color={coerceMetric(metric)}>
					{formatNumber(value)}
						</span>
				{/if}
			</span>
		</p>
	</div>

	<div class="rank font-sans text-sm tracking-tight text-zinc-400 px-4">
		<div class="mt-2 flex-col border-zinc-700 pt-2">
			<div class="text-right flex flex-col">
				{#each races as race}
					<div class="flex flex-row justify-between w-48 py-0.5 px-2">
						<span class="flex text-sm text-zinc-400 tracking-tighter">{raceLabels[race]}</span>
						<div class="flex font-mono text-zinc-300">
							{#if isMoney}
										<span class="text-green-600">
										<Money value={getDollarValue(race, metric)} /></span>
							{:else}
										<span>
										<Percent value={getPercentValue(race, metric)} />
							</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
