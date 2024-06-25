<script lang="ts">
	import { formatMoneyValue, formatNumber, sortTopJudges, sortAllCounties, sortAllJudges } from '$lib/utils';
	import type { CountyExpandedProperties, CountyFeature, CountyProperties, JudgeExpandedProperties } from '$lib/types';
	import {
		allCountiesStore,
		selectedCountyStore,
		selectedJudgeStore,
		selectedMetricStore,
		showCountyJudgesStore,
		countyJudgesStore,
		allJudgesStore
	} from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';
	import Money from '$lib/components/Money.svelte';

	let selectedCountyInfo: CountyExpandedProperties | null = null;
	let selectedJudgeInfo: JudgeExpandedProperties | null = null;
	let topJudgesPromise: Promise<JudgeExpandedProperties[]> | null = null;
	let topJudges: JudgeExpandedProperties[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let allCounties: CountyFeature[] = [];

	// Reactive declarations
	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: topJudges = $countyJudgesStore;
	$: topJudgesPromise = Promise.resolve(topJudges);
	$: allJudges = sortAllJudges($allJudgesStore, metric);
	$: allJudgesPromise = Promise.resolve(allJudges);
	$: allCounties = $allCountiesStore;
	$: allCountiesPromise = Promise.resolve(allCounties);

	// Sort top judges by selected metric
	$: topJudges = sortTopJudges(topJudges, metric);


	// Sort top counties by selected metric
	$: topCounties = sortAllCounties(allCounties, metric).slice(0, 5);

	let hoveredStat: string | null = null;

	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}
</script>

<div
	class="judge-detail rounded-lg p-4 md:p-6 bg-zinc-800 hover:outline outline-zinc-700 shadow-lg flex-col flex">
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => showCountyJudgesStore.set(false)}>
			<Close />
		</button>
	</div>

	<h2 class="font-bold text-xl md:text-2xl text-gray-50 mb-2">Top Judges in New York State</h2>

	<div class="all-judges-scroller">
		{#await allJudgesPromise}
			<p class="text-zinc-400">Fetching top counties...</p>
		{:then allJudges}
			{#if allJudges && allJudges.length > 0}
				<ul class="space-y-2">
					{#each allJudges.slice(0, 100) as judge, index}
						<button on:click={() => selectedJudgeStore.set(judge)}
										class="list-item w-full text-left {judge.judge_name === selectedJudgeInfo?.judge_name ? 'selected' : ''}">
								<span class="float-right top-0 pt-1">{index + 1}.</span>
							<p class="text-lg text-zinc-300 font-bold pb-1">{judge.judge_name}</p>

							<div class="font-mono  w-full">
								{#if metric === 'bail'}
									<Money value={hoveredStat === 'amount' ? judge * judge.cases_bail_set : judge.average_bail_set} />
									<span class="case-count text-zinc-300 super">
                      <p class="text-xs float-right align-super">({formatNumber(judge.cases_bail_set)} cases)</p>
                    </span>
								{/if}
								{#if metric === 'release'}
										<span
											class="text-green-600">{formatNumber((judge.cases_ror_pct + judge.cases_nmr_pct) * 100)}</span>
									<span class="text-gray-300 -ml-1">%</span>
									<span class="case-count text-zinc-300 super">
                      <p class="text-xs float-right align-super">({formatNumber(judge.cases_ror + judge.cases_nmr)}
												cases)</p>
                    </span>
								{/if}
								{#if metric === 'remand'}
									<span class="text-red-600">{formatNumber(judge.cases_remand_pct * 100)}</span>
									<span class="text-gray-300 -ml-1">%</span>
									<span class="case-count text-zinc-300 super">
                      <p class="text-xs float-right align-super">({formatNumber(judge.cases_remand)} cases)</p>
                    </span>
								{/if}
							</div>
						</button>
					{/each}
				</ul>
			{:else}
				<p class="text-zinc-400">No counties found.</p>
			{/if}
		{:catch error}
			<p class="text-red-500">Error fetching top counties: {error.message}</p>
		{/await}
	</div>
</div>

<style>

</style>