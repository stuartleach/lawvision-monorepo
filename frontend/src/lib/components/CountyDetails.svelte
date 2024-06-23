<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { CountyProperties, JudgeProperties } from '$lib/types';
	import { selectedCountyStore, selectedJudgeStore, selectedMetricStore, topJudgesStore } from '$lib/stores/data';
	import { get } from 'svelte/store';
	import Close from '$lib/assets/Close.svelte';

	let selectedCountyInfo: CountyProperties | null = null;
	let selectedJudgeInfo: JudgeProperties | null = null;
	let topJudgesPromise: Promise<JudgeProperties[]> | null = null;
	let topJudges: JudgeProperties[] = [];
	let metric: 'bail' | 'remand' | 'ror' = 'bail';
	let cases_set_bail: number = $selectedCountyStore?.cases_set_bail ?? 0;
	let cases_ror = $selectedCountyStore?.cases_ror ?? 0;
	let cases_remand = $selectedCountyStore?.cases_remand ?? 0;
	let cases_unknown = $selectedCountyStore?.cases_unknown ?? 0;

	// Reactive declarations
	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: topJudges = $topJudgesStore;
	$: topJudgesPromise = Promise.resolve(topJudges);
	$: countyName = $selectedCountyStore?.name ?? '';
	$: bailAmount = $selectedCountyStore?.average_bail_amount ?? 0;
	$: [bailDollars, bailCents] = formatMoney(bailAmount).split('.');
	let numberOfCasesRaw = 0;
	$: numberOfCasesRaw = $selectedCountyStore?.number_of_cases ?? 0;
	$: numberOfCases = formatNumber($selectedCountyStore?.number_of_cases ?? 0);

	$: console.log('selectedCountyStore', $selectedCountyStore);

</script>

<div
	class="county-detail flex-1 rounded-lg p-4 md:p-6 bg-zinc-800 hover:outline outline-zinc-700 shadow-lg flex-col flex">
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={()=>selectedCountyStore.set(null)}>
			<Close />
		</button>
	</div>
	<h1 class="text-2xl md:text-3xl font-semibold tracking-tight text-gray-50">{countyName} County</h1>

	<div class="overview my-4">
		<div class="text-zinc-400 mb-2">Average bail amount:
			<span class="text-green-600">$</span>
			<span class="font-bold text-white font-mono">{bailDollars}</span>&nbsp;<span
				class="super font-mono">.{bailCents}</span>

			<p>Bail set in {(cases_set_bail / numberOfCasesRaw * 100).toFixed(2)}% of cases.</p>
			<p>Remand set in {(cases_remand / numberOfCasesRaw * 100).toFixed(2)}% of cases.</p>
			<p>ROR set in {(cases_ror / numberOfCasesRaw * 100).toFixed(2)}% of cases.</p>
			<p>Unknown in {(cases_unknown / numberOfCasesRaw * 100).toFixed(2)}% of cases.</p>
		</div>
		<p class="text-zinc-400 mb-4">Number of cases:
			<span class="font-bold text-white font-mono">{numberOfCases}</span>
		</p>
	</div>

	<h2 class="font-bold text-xl md:text-2xl text-gray-50">Top Judges</h2>

	<nav class="details-nav bg-neutral-900 rounded-lg py-1 flex flex-row w-full justify-between my-4">
		<button on:click={() => selectedMetricStore.set('bail')}
						class="text-md font-semibold tracking-tight text-yellow-400 {metric === 'bail' ? 'selected' : ''}">Bail
		</button>
		<button on:click={() => selectedMetricStore.set('ror')}
						class="text-md font-semibold tracking-tight text-green-400 {metric === 'ror' ? 'selected' : ''}">ROR
		</button>
		<button on:click={() => selectedMetricStore.set('remand')}
						class="text-md font-semibold tracking-tight text-red-400 {metric === 'remand' ? 'selected' : ''}">Remand
		</button>
	</nav>

	<div class="overflow-y-scroll">
		{#await topJudgesPromise}
			<p class="text-zinc-400">Fetching top judges...</p>
		{:then judges}
			{#if judges && judges.length > 0}
				<ul class="space-y-2">
					{#each judges as judge}
						<button on:click={() => selectedJudgeStore.set(judge)}
										class="judge-item w-full text-left {judge.judge_name === selectedJudgeInfo?.judge_name ? 'selected' : ''}">
							<p class="text-lg text-zinc-300 font-bold pb-1">{judge.judge_name}</p>
							<p class="font-mono">
								<span class="text-green-600">$</span>
								<span class="text-gray-300">{formatMoney(judge.average_bail_set).split('.')[0]}</span>
								<span
									class="text-gray-500 -ml-2 tracking-tighter text-xs align-text-top">.{formatMoney(judge.average_bail_set).split('.')[1]}</span>
								<span class="case-count text-zinc-300 super">
									<p class="text-xs float-right align-super">({formatNumber(judge.case_count)} cases)</p>
								</span>
							</p>
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
