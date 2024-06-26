<script lang="ts">
	import { formatMoney, formatMoneyValue, formatNumber, sortTopJudges } from '$lib/utils';
	import type { County, Judge } from '$lib/types/types';
	import {
		selectedCountyStore,
		selectedJudgeStore,
		selectedMetricStore,
		showCountyJudgesStore,
		countyJudgesStore
	} from '$lib/stores/data';
	import { get } from 'svelte/store';
	import Close from '$lib/assets/Close.svelte';
	import ScrollableList from '$lib/components/ScrollableList.svelte';
	import { LawCard } from '$lib/components/index';

	let selectedJudgeInfo: Judge | null = null;
	let topJudgesPromise: Promise<Judge[]> | null = null;
	let topJudges: Judge[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let cases_bail_set = 0;
	let cases_ror = 0;
	let cases_remand = 0;
	let cases_unknown = 0;

	let county: County | null = null;

	$: county = $selectedCountyStore;

	$: casesBailSet = county?.stats.raw.bailSet ?? 0;
	$: casesRor = county?.stats.raw.ror ?? 0;
	$: casesRemand = county?.stats.raw.remand ?? 0;
	$: casesUnknown = county?.stats.raw.unknown ?? 0;

	$: casesBailSetPct = county?.stats.pct.bailSet ?? 0;
	$: casesRorPct = county?.stats.pct.ror ?? 0;
	$: casesRemandPct = county?.stats.pct.remand ?? 0;
	$: casesUnknownPct = county?.stats.pct.unknown ?? 0;

	// Reactive declarations

	let countyJudgesPromise: Promise<Judge[]>;

	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: countyJudges = $countyJudgesStore;
	$: countyJudgesPromise = Promise.resolve(countyJudges);

	// order top judges by metric
	$: topJudges = sortTopJudges(topJudges, metric);

</script>

<LawCard>
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
				<ScrollableList>
					{#each judges as judge}
						<button on:click={() => selectedJudgeStore.set(judge)}
										class="judge-item w-full text-left {judge.name === selectedJudgeInfo?.name ? 'selected' : ''}">
							<p class="text-lg text-zinc-300 font-bold pb-1">{judge.name}</p>
							<div class="">
								{#if metric === 'bail'}
									<p class="font-mono">
										<span class="text-green-600">$</span>
										<span class="text-gray-300">{formatMoney(judge.stats.averageBailSet).split('.')[0]}</span>
										<span
											class="text-gray-500 -ml-2 tracking-tighter text-xs align-text-top">.{formatMoney(judge.stats.averageBailSet).split('.')[1]}</span>
										<span class="case-count text-zinc-300 super">
									<p class="text-xs float-right align-super">({formatNumber(judge.stats.raw.bailSet)} cases)</p>
								</span>
									</p>
								{/if}
								{#if metric === 'release'}
									<p class="font-mono">
										<span
											class="text-green-600">{formatNumber(judge.stats.pct.release * 100)}</span>
										<span class="text-gray-300 -ml-1">%</span>
										<span class="case-count text-zinc-300 super">
									<p class="text-xs float-right align-super">({formatNumber(judge.stats.raw.release)}
										cases)</p>
								</span>
									</p>
								{/if}
								{#if metric === 'remand'}
									<p class="font-mono">
										<span class="text-red-600">{formatNumber(judge.stats.pct.remand * 100)}</span>
										<span class="text-gray-300 -ml-1">%</span>
										<span class="case-count text-zinc-300 super">
									<p class="text-xs float-right align-super">({formatNumber(judge.stats.raw.remand)} cases)</p>
								</span>
									</p>
								{/if}
							</div>
						</button>
					{/each}
				</ScrollableList>
			{:else}
				<p class="text-zinc-400">No judges found for this county.</p>
			{/if}
		{:catch error}
			<p class="text-red-500">Error fetching top judges: {error.message}</p>
		{/await}
	</div>
</LawCard>

<style>
    /* Your styles here */
</style>
