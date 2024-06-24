<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { CountyProperties, JudgeProperties, CountyExpandedProperties } from '$lib/types';
	import {
		selectedCountyStore,
		selectedJudgeStore,
		selectedMetricStore, showCountyJudgesStore,
		stateBailCases,
		countyJudgesStore
	} from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';

	let selectedCountyInfo: CountyExpandedProperties | null = null;
	let selectedJudgeInfo: JudgeProperties | null = null;
	let topJudges: JudgeProperties[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let hoveredStat: string | null = null;

	// Reactive declarations
	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: topJudges = $countyJudgesStore;

	// State-level data
	$: cases_bail_set = stateBailCases.bailSetCases;
	$: cases_ror = stateBailCases.rorCases;
	$: cases_remand = stateBailCases.remandCases;
	$: cases_unknown = stateBailCases.unknownCases;
	$: averageBailAmount = stateBailCases.averageBailAmount;
	$: numberOfCasesRaw = stateBailCases.totalCases;
	$: numberOfCases = formatNumber(stateBailCases.totalCases);
	$: totalBailAmount = stateBailCases.totalBailSetAmount;


	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}
</script>

<div class="judge-detail flex-1 rounded-lg p-4 md:p-6 bg-zinc-800 hover:outline outline-zinc-700 shadow-lg flex-col flex">
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4"
						on:click={() => {showCountyJudgesStore.set(false); selectedCountyStore.set(null)}}>
			<Close />
		</button>
	</div>
	<h2>New York State</h2>
	<div>
		<ul class="space-y-2">
			<li class="judge-stat">
				<h3 class="text-lg text-zinc-300 font-bold">Number of cases:</h3>
				<p class="font-bold text-right text-zinc-400 font-mono">
					{formatNumber(numberOfCasesRaw)}
				</p>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('amount')} on:mouseleave={handleMouseLeave}>
				<div class="left text-left">
					<h3>{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				</div>
				<div class="right text-right">
					<div class="money flex-row text-right">
						<span class="text-green-600">$</span>
						<span class="font-bold text-white font-mono">
							{hoveredStat === 'amount' ? formatMoney(totalBailAmount).split('.')[0] : formatMoney(averageBailAmount).split('.')[0]}
						</span>&nbsp;<span class="super font-mono">
							.{formatMoney(averageBailAmount).split('.')[1]}
						</span>
					</div>
				</div>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('remand')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-red-600">
					{hoveredStat === 'remand' ? formatNumber(cases_remand) : formatNumber((cases_remand / numberOfCasesRaw) * 100) + '%'}
				</p>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('release')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-green-600">
					{hoveredStat === 'release' ? formatNumber(cases_ror) : formatNumber((cases_ror / numberOfCasesRaw) * 100) + '%'}
				</p>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('bail')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-yellow-300">
					{hoveredStat === 'bail' ? formatNumber(cases_bail_set) : formatNumber((cases_bail_set / numberOfCasesRaw) * 100) + '%'}
				</p>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('unknown')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}
				</h3>
				<p class="font-bold font-mono text-right text-zinc-600">
					{hoveredStat === 'unknown' ? formatNumber(cases_unknown) : formatNumber((cases_unknown / numberOfCasesRaw) * 100) + '%'}
				</p>
			</li>
		</ul>
	</div>
</div>

<style>
</style>
