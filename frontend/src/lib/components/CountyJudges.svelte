<script lang="ts">
	import { formatMoney, formatMoneyValue, formatNumber, sortTopJudges } from '$lib/utils';
	import type { CountyProperties, JudgeExpandedProperties, JudgeProperties } from '$lib/types';
	import {
		selectedCountyStore,
		selectedJudgeStore,
		selectedMetricStore,
		showCountyJudgesStore,
		countyJudgesStore
	} from '$lib/stores/data';
	import { get } from 'svelte/store';
	import Close from '$lib/assets/Close.svelte';

	let selectedCountyInfo: CountyProperties | null = null;
	let selectedJudgeInfo: JudgeExpandedProperties | null = null;
	let topJudgesPromise: Promise<JudgeExpandedProperties[]> | null = null;
	let topJudges: JudgeExpandedProperties[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let cases_bail_set = 0;
	let cases_ror = 0;
	let cases_remand = 0;
	let cases_unknown = 0;

	$:  cases_bail_set = $selectedCountyStore?.cases_bail_set ?? 0;
	$: cases_ror = $selectedCountyStore?.cases_ror ?? 0;
	$: cases_remand = $selectedCountyStore?.cases_remand ?? 0;
	$: cases_unknown = $selectedCountyStore?.cases_unknown ?? 0;

	// Reactive declarations

	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: countyJudges = $countyJudgesStore;
	$: countyJudgesPromise = Promise.resolve(countyJudges);

	// order top judges by metric
	$: topJudges = sortTopJudges(topJudges, metric);

	$: countyName = $selectedCountyStore?.name ?? '';
	$: bailAmount = $selectedCountyStore?.average_bail_set ?? 0;
	$: [bailDollars, bailCents] = formatMoneyValue(bailAmount);
	let numberOfCasesRaw = 0;
	$: numberOfCasesRaw = $selectedCountyStore?.number_of_cases ?? 0;
	$: numberOfCases = formatNumber($selectedCountyStore?.number_of_cases ?? 0);

</script>

<div
	class="county-detail rounded-lg p-4 md:p-6 bg-zinc-800 hover:outline outline-zinc-700 shadow-lg flex-col flex county-judges-scroller">
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={()=>showCountyJudgesStore.set(false)}>
			<Close />
		</button>
	</div>


	<h2 class="font-bold text-xl md:text-2xl text-gray-50 mb-2">Top Judges in {$selectedCountyStore?.name} County</h2>


	<div class="overflow-y-scroll">
		{#await countyJudgesPromise}
			<p class="text-zinc-400">Fetching top judges...</p>
		{:then judges}
			{#if judges && judges.length > 0}
				<ul class="space-y-2">
					{#each judges as judge}
						<button on:click={() => selectedJudgeStore.set(judge)}
										class="judge-item w-full text-left {judge.judge_name === selectedJudgeInfo?.judge_name ? 'selected' : ''}">
							<p class="text-lg text-zinc-300 font-bold pb-1">{judge.judge_name}</p>
							<div class="">
								{#if metric === 'bail'}
									<p class="font-mono">
										<span class="text-green-600">$</span>
										<span class="text-gray-300">{formatMoney(judge.average_bail_set).split('.')[0]}</span>
										<span
											class="text-gray-500 -ml-2 tracking-tighter text-xs align-text-top">.{formatMoney(judge.average_bail_set).split('.')[1]}</span>
										<span class="case-count text-zinc-300 super">
									<p class="text-xs float-right align-super">({formatNumber(judge.cases_bail_set)} cases)</p>
								</span>
									</p>
								{/if}
								{#if metric === 'release'}
									<p class="font-mono">
										<span class="text-green-600">{formatNumber((judge.cases_ror_pct + judge.cases_nmr_pct) * 100 )}</span>
										<span class="text-gray-300 -ml-1">%</span>
										<span class="case-count text-zinc-300 super">
									<p class="text-xs float-right align-super">({formatNumber(judge.cases_ror + judge.cases_nmr)} cases)</p>
								</span>
									</p>
								{/if}
								{#if metric === 'remand'}
									<p class="font-mono">
										<span class="text-red-600">{formatNumber(judge.cases_remand_pct * 100)}</span>
										<span class="text-gray-300 -ml-1">%</span>
										<span class="case-count text-zinc-300 super">
									<p class="text-xs float-right align-super">({formatNumber(judge.cases_remand)} cases)</p>
								</span>
									</p>
								{/if}
							</div>
						</button>
					{/each}
				</ul>
			{:else}
				<p class="text-zinc-400">No judges found for this county.</p>
			{/if}
		{:catch error}
			<p class="text-red-500">Error fetching top judges: {error.message}</p>
		{/await}
	</div>
</div>

<style>
    /* Your styles here */
</style>
