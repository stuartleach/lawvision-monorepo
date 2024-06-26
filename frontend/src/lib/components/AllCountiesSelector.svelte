<script lang="ts">
	import { formatNumber, sortTopJudges, sortAllCounties } from '$lib/utils';
	import type { County, Judge } from '$lib/types';
	import {
		allCountiesStore,
		selectedCountyStore,
		selectedJudgeStore,
		selectedMetricStore,
		showCountyJudgesStore,
		countyJudgesStore
	} from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';
	import Money from '$lib/components/Money.svelte';
	import { LawCard } from '$lib/components/index';

	let selectedCountyInfo: County | null = null;
	let selectedJudgeInfo: Judge | null = null;
	let topJudgesPromise: Promise<Judge[]> | null = null;
	let topJudges: Judge[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let allCounties: County[] = [];

	// Reactive declarations
	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: topJudges = $countyJudgesStore;
	$: topJudgesPromise = Promise.resolve(topJudges);
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

	$: Promise.resolve(allCounties);
</script>

<LawCard>
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => showCountyJudgesStore.set(false)}>
			<Close />
		</button>
	</div>

	<h2 class="font-bold text-xl md:text-2xl text-gray-50 mb-2">Top Counties</h2>

	<div class="overflow-y-scroll">
		{#await allCountiesPromise}
			<p class="text-zinc-400">Fetching top counties...</p>
		{:then topCounties}
			{#if topCounties && topCounties.length > 0}
				<ul class="space-y-2">
					{#each topCounties.slice(0, 5) as county}
						<button on:click={() => selectedCountyStore.set(county)}
										class:selected="{county.name === selectedCountyInfo?.name}"
										class="list-item w-full text-left">
							<p class="text-lg text-zinc-300 font-bold pb-1">{county.name}</p>
							<div class="">
								{#if metric === 'bail'}
									<p class="font-mono">
										<Money
											value={hoveredStat === 'amount' ? county.stats.totalBailSet : county.stats.averageBailSet} />
										<span class="case-count text-zinc-300 super">
                                        <p
																					class="text-xs float-right align-super">({formatNumber(county.stats.raw.bailSet)}
																					cases)</p>
                                    </span>
									</p>
								{/if}
								{#if metric === 'release'}
									<p class="font-mono">
										<span
											class="text-green-600">{formatNumber((county.stats.pct.release) * 100)}</span>
										<span class="text-gray-300 -ml-1">%</span>
										<span class="case-count text-zinc-300 super">
                                        <p
																					class="text-xs float-right align-super">({formatNumber(county.stats.raw.release)}
																					cases)</p>
                                    </span>
									</p>
								{/if}
								{#if metric === 'remand'}
									<p class="font-mono">
										<span class="text-red-600">{formatNumber(county.stats.pct.remand * 100)}</span>
										<span class="text-gray-300 -ml-1">%</span>
										<span class="case-count text-zinc-300 super">
                                        <p
																					class="text-xs float-right align-super">({formatNumber(county.stats.raw.remand)}
																					cases)</p>
                                    </span>
									</p>
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
</LawCard>
