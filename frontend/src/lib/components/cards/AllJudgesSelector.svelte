<script lang="ts">
	import { formatNumber, sortBy } from '$lib/utils';
	import type { County, Judge } from '$lib/types';
	import {
		allCountiesStore,
		selectedCountyStore,
		selectedJudgeStore,
		selectedMetricStore,
		showCountyJudgesStore,
		countyJudgesStore,
		allJudgesStore
	} from '$lib/stores/data';
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import ClickableListSelector from '$lib/components/shared/ClickableListSelector.svelte';
	import ScrollableList from '$lib/components/shared/ScrollableList.svelte';
	import SortBadge from '$lib/components/shared/SortBadge.svelte';
	import LawCard from '$lib/components/cards/LawCard.svelte';
	import Money from '$lib/components/shared/Money.svelte';


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
	$: allJudges = sortBy($allJudgesStore, metric);
	$: allJudgesPromise = Promise.resolve(allJudges);
	$: allCounties = $allCountiesStore;
	$: allCountiesPromise = Promise.resolve(allCounties);

	let hoveredStat: string | null = null;

	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}
</script>


<LawCard>

	<h4 slot="super-title">Top Judges in </h4>
	<h2 slot="title">New York State
		<SortBadge />
	</h2>
	<div slot="data">
		{#await allJudgesPromise}
			<p class="text-zinc-400">Fetching top counties...</p>
		{:then allJudges}
			{#if allJudges && allJudges.length > 0}
				<ScrollableList>
					{#each allJudges.slice(0, 100) as judge, index}
						<ClickableListSelector
							onClick={() => selectedJudgeStore.set(judge)}
							className="{judge.name === selectedJudgeInfo?.name ? 'selected' : ''}">
							<p slot="title">{judge.name}</p>
							<div slot="stat">
								{#if metric === 'bail'}
									<Money
										value={hoveredStat === 'amount' ? Number(judge) * judge.stats.totalBailSet : judge.stats.averageBailSet} />
									<p class="text-xs align-super text-right">({formatNumber(judge.stats.raw.bailSet)} cases)</p>
								{/if}
								{#if metric === 'release'}
										<span
											class="text-green-600">
											<HoverableItem
												targetBool={hoveredStat === 'release'}
												valueWhenNotHovered={formatNumber(judge.stats.pct.release * 100) + '%'}
												valueWhenHovered={formatNumber(judge.stats.raw.release)} />
										</span>
									<span class="text-gray-300 -ml-1">%</span>
									<p class="text-xs align-super text-right">({formatNumber(judge.stats.raw.release)} cases)</p>

								{/if}
								{#if metric === 'remand'}
									<span class="text-red-600"><HoverableItem
										targetBool={hoveredStat === 'remand'}
										valueWhenNotHovered={formatNumber(judge.stats.pct.remand * 100) + '%'}
										valueWhenHovered={formatNumber(judge.stats.raw.remand)} /></span>
									<span class="text-gray-300 -ml-1">%</span>
									<p class="text-xs align-super text-right">({formatNumber(judge.stats.raw.remand)} cases)</p>

								{/if}
							</div>
						</ClickableListSelector>
					{/each}
				</ScrollableList>
			{:else}
				<p class="text-zinc-400">No counties found.</p>
			{/if}
		{:catch error}
			<p class="text-red-500">Error fetching top counties: {error.message}</p>
		{/await}

	</div>
</LawCard>

