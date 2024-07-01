<script lang="ts">
	import { formatNumber, sortBy } from '$lib/utils';
	import type { County, Judge } from '$lib/types';
	import {
		allCountiesStore,
		selectedCountyStore,
		selectedMetricStore,
		showCountyJudgesStore,
		countyJudgesStore,
		countyJudgesPromiseStore
	} from '$lib/stores/data';
	import LawCard from '$lib/components/cards/LawCard.svelte';
	import SortBadge from '$lib/components/shared/SortBadge.svelte';
	import ScrollableList from '$lib/components/shared/ScrollableList.svelte';
	import ClickableListSelector from '$lib/components/shared/ClickableListSelector.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';


	let selectedCountyInfo: County | null = null;
	let selectedJudgeInfo: Judge | null = null;
	let topJudgesPromise: Promise<Judge[]> | null = null;
	let topJudges: Judge[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let allCounties: County[] = [];

	// Reactive declarations
	$: metric = $selectedMetricStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: topJudges = $countyJudgesStore;
	$: topJudgesPromise = Promise.resolve(topJudges);
	$: allCounties = $allCountiesStore;
	$: allCountiesPromise = Promise.resolve(allCounties);


	// Sort top counties by selected metric
	$: topCounties = sortBy(allCounties, metric).slice(0, 5);

	let hoveredStat: string | null = null;

	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}
</script>


<LawCard>
	<h4 slot="super-title">Top Counties in </h4>
	<h2 slot="title">New York State
		<SortBadge />
	</h2>

	<div slot="data">
		{#await allCountiesPromise}
			<p class="text-zinc-400">Fetching top counties...</p>
		{:then allCounties}
			{#if allCounties && allCounties.length > 0}
				<ScrollableList>
					{#each allCounties.slice(0, 100) as county, index}
						<ClickableListSelector
							onClick={() => selectedCountyStore.set(county)}
							className="{county.name === selectedJudgeInfo?.name ? 'selected' : ''}">
							<p slot="title">{county.name}</p>
							<div slot="stat">
								{#if metric === 'bail'}
									<Money
										value={hoveredStat === 'amount' ? Number(county) * county.stats.totalBailSet : county.stats.averageBailSet} />
									<p class="text-xs align-super text-right">({formatNumber(county.stats.raw.bailSet)} cases)</p>
								{/if}
								{#if metric === 'release'}
										<span
											class="text-green-600">
											<HoverableItem
												targetBool={hoveredStat === 'remand'}
												valueWhenNotHovered={formatNumber(county.stats.pct.release * 100) + '%'}
												valueWhenHovered={formatNumber(county.stats.raw.release)} />
										</span>
									<span class="text-gray-300 -ml-1">%</span>
								{/if}
								{#if metric === 'remand'}
									<span class="text-red-600"><HoverableItem
										targetBool={hoveredStat === 'remand'}
										valueWhenNotHovered={formatNumber(county.stats.pct.remand * 100) + '%'}
										valueWhenHovered={formatNumber(county.stats.raw.remand)} /></span>
									<span class="text-gray-300 -ml-1">%</span>
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

