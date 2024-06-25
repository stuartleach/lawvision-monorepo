<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { County, Judge, CountyExpandedProperties } from '$lib/types/types';
	import { selectedCountyStore, selectedJudgeStore, selectedMetricStore, countyJudgesStore } from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';

	let selectedCountyInfo: CountyExpandedProperties | null = null;
	let selectedJudgeInfo: Judge | null = null;
	let topJudges: Judge[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let hoveredStat: string | null = null;

	// Reactive declarations
	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: topJudges = $countyJudgesStore;

	$: cases_bail_set = selectedCountyInfo?.countyProps.cases_bail_set ?? 0;
	$: cases_ror = selectedCountyInfo?.countyProps.cases_ror ?? 0;
	$: cases_remand = selectedCountyInfo?.countyProps.cases_remand ?? 0;
	$: cases_unknown = selectedCountyInfo?.countyProps.cases_unknown ?? 0;
	$: countyName = selectedCountyInfo?.countyProps.name ?? '';
	$: bailAmount = selectedCountyInfo?.countyProps.average_bail_set ?? 0;
	$: numberOfCasesRaw = selectedCountyInfo?.countyProps.number_of_cases ?? 0;
	$: numberOfCases = formatNumber(selectedCountyInfo?.countyProps.number_of_cases ?? 0);

	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}
</script>

<div class="judge-detail">
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => selectedCountyStore.set(null)}>
			<Close />
		</button>
	</div>
	<h2>{countyName} County</h2>
	<div>
		<ul class="space-y-2">
			<li class="stat">
				<h3 class="text-lg text-zinc-300 font-bold">Number of cases:</h3>
				<p class="font-bold text-right text-zinc-400 font-mono">
					{formatNumber(numberOfCasesRaw)}
				</p>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('amount')} on:mouseleave={handleMouseLeave}>
				<div class="left text-left">
					<h3>{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				</div>
				<div class="right text-right">
					<div class="money flex-row text-right">
						<span class="text-green-600">$</span>
						<span class="font-bold text-white font-mono">
							{selectedCountyInfo ? formatMoney(hoveredStat === 'amount' ? selectedCountyInfo?.countyProps.cases_bail_set * selectedCountyInfo.countyProps.average_bail_set : selectedCountyInfo.countyProps.average_bail_set).split('.')[0] : '0'}
						</span>&nbsp;<span class="super font-mono">
							.{selectedCountyInfo ? formatMoney(selectedCountyInfo.countyProps.average_bail_set).split('.')[1] : '00'}
						</span>
					</div>
				</div>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('remand')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-red-600">
					{hoveredStat === 'remand' ? formatNumber(selectedCountyInfo?.countyProps.cases_remand) : (selectedCountyInfo ? formatNumber((selectedCountyInfo.countyProps.cases_remand / selectedCountyInfo.countyProps.number_of_cases) * 100) + '%' : '0%')}
				</p>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('release')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-green-600">
					{hoveredStat === 'release' ? formatNumber(Number(selectedCountyInfo?.countyProps.cases_nmr) + Number(selectedCountyInfo?.countyProps.cases_ror)) : (selectedCountyInfo ? formatNumber(((selectedCountyInfo.countyProps.cases_nmr + selectedCountyInfo.countyProps.cases_ror) / selectedCountyInfo.countyProps.number_of_cases) * 100) + '%' : '0%')}
				</p>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('bail')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-yellow-300">
					{hoveredStat === 'bail' ? formatNumber(selectedCountyInfo?.countyProps.cases_bail_set) : (selectedCountyInfo ? formatNumber((selectedCountyInfo.countyProps.cases_bail_set / selectedCountyInfo.countyProps.number_of_cases) * 100) + '%' : '0%')}
				</p>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('unknown')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}
				</h3>
				<p class="font-bold font-mono text-right text-zinc-600">
					{hoveredStat === 'unknown' ? formatNumber(selectedCountyInfo?.countyProps.cases_unknown) : (selectedCountyInfo ? formatNumber((selectedCountyInfo.countyProps.cases_unknown / selectedCountyInfo.countyProps.number_of_cases) * 100) + '%' : '0%')}
				</p>
			</li>
		</ul>
	</div>
</div>

