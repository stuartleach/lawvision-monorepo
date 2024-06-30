<script lang="ts">
	import { formatNumber, sortBy } from '$utils';
	import type { County, Judge } from '$types';
	import {
		allCountiesStore,
		selectedCountyStore,
		selectedJudgeStore,
		selectedMetricStore,
		countyJudgesStore,
		allJudgesStore
	} from '$data';

	import {
		Money,
		LawCard,
		CloseButton,
		ScrollableList,
		HoverableItem,
		ClickableListSelector,
		SortBadge
	} from '$components';
	import BarPlot from '$lib/components/BarPlot.svelte';

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

	let allJudges: Judge[];
	$: allJudges = sortBy($allJudgesStore, metric);
	$: allJudgesPromise = Promise.resolve(allJudges);
	$: allCounties = $allCountiesStore;
	$: allCountiesPromise = Promise.resolve(allCounties);

	$: allJudges = allJudges.map(judge => ({
		counties: judge.counties.map(county => county.toLowerCase()),
		...judge
	}));

	let countyJudges: Judge[] = [];

	$: countyJudges = allJudges.filter(judge => judge.counties.includes(selectedCountyInfo?.name));

	$: countyJudgesStore.set(countyJudges);

	$: console.log($countyJudgesStore);

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
	<h2 slot="title">{selectedCountyInfo?.name} County
		<SortBadge />

	</h2>
	<div slot="data">
		{#await topJudgesPromise}
			<p class="text-zinc-400">Fetching top counties...</p>
		{:then allJudges}
			{#if countyJudges && countyJudges.length > 0}
				<ScrollableList>
					{#each countyJudges.slice(0, 100) as judge, index}
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
												targetBool={hoveredStat === 'remand'}
												valueWhenNotHovered={formatNumber(judge.stats.pct.release * 100) + '%'}
												valueWhenHovered={formatNumber(judge.stats.raw.release)} />
										</span>
									<span class="text-gray-300 -ml-1">%</span>
								{/if}
								{#if metric === 'remand'}
									<span class="text-red-600"><HoverableItem
										targetBool={hoveredStat === 'remand'}
										valueWhenNotHovered={formatNumber(judge.stats.pct.remand * 100) + '%'}
										valueWhenHovered={formatNumber(judge.stats.raw.remand)} /></span>
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
