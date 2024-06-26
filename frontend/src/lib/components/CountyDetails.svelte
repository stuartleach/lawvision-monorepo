<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { County, Judge } from '$lib/types/types';
	import { selectedCountyStore, selectedJudgeStore, selectedMetricStore, countyJudgesStore } from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';
	import { LawCard } from '$lib/components/index';
	import ScrollableList from '$lib/components/ScrollableList.svelte';
	import ClickableListItem from '$lib/components/ClickableListItem.svelte';
	import Money from '$lib/components/Money.svelte';
	import HoverableItem from '$lib/components/HoverableItem.svelte';

	let county: County | null = null;
	let selectedJudgeInfo: Judge | null = null;
	let topJudges: Judge[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let hoveredStat: string | null = null;

	// Reactive declarations
	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: county = $selectedCountyStore;
	$: topJudges = $countyJudgesStore;
	let countyName: string;
	let totalBailAmount: number;
	let numberOfCasesRaw: number;

	let selectedCountyInfo: County | null;


	$: casesBailSet = county?.stats.raw.bailSet ?? 0;
	$: casesRelease = county?.stats.raw.release ?? 0;
	$: casesRemand = county?.stats.raw.remand ?? 0;
	$: casesUnknown = county?.stats.raw.unknown ?? 0;

	$: casesBailSetPct = county?.stats.pct.bailSet ?? 0;
	$: casesReleasePct = county?.stats.pct.release ?? 0;
	$: casesRemandPct = county?.stats.pct.remand ?? 0;
	$: casesUnknownPct = county?.stats.pct.unknown ?? 0;

	$: selectedCountyInfo = $selectedCountyStore;


	$: countyName = county?.name ?? '';
	$: averageBailAmount = county?.stats.averageBailSet ?? 0;
	$: totalBailAmount = county?.stats.totalBailSet ?? 0;
	$: numberOfCasesRaw = county?.stats.caseCount ?? 0;
	$: numberOfCases = formatNumber(county?.stats.caseCount ?? 0);

	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}
</script>

<LawCard>
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => selectedCountyStore.set(null)}>
			<Close />
		</button>
	</div>
	<h2>{countyName} County</h2>
	<div>
		<ScrollableList>
			<ClickableListItem>
				<h3 slot="title">Number of cases:</h3>
				<p class="font-bold text-right text-zinc-400 font-mono">
					{formatNumber(numberOfCasesRaw)}
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('amount')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				<p slot="stat">
					<Money
						value={selectedCountyInfo ? (hoveredStat === 'amount' ? selectedCountyInfo.stats.totalBailSet : selectedCountyInfo.stats.averageBailSet) : 0} />
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('remand')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}</h3>
				<p slot="stat" class="text-red-600">
					<HoverableItem
						targetBool={hoveredStat === 'remand'}
						valueWhenNotHovered={selectedCountyInfo ? formatNumber(selectedCountyInfo.stats.pct.remand * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber(selectedCountyInfo?.stats.raw.remand)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('release')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}</h3>
				<p slot="stat" class="text-green-600">
					<HoverableItem
						targetBool={hoveredStat === 'release'}
						valueWhenNotHovered={selectedCountyInfo ? formatNumber(selectedCountyInfo.stats.pct.release * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber(selectedCountyInfo?.stats.raw.release)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('bail')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}</h3>
				<p slot="stat" class="text-yellow-300">
					<HoverableItem
						targetBool={hoveredStat === 'bail'}
						valueWhenNotHovered={selectedCountyInfo ? formatNumber(selectedCountyInfo.stats.pct.bailSet * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber(selectedCountyInfo?.stats.raw.bailSet)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('unknown')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}</h3>
				<p slot="stat" class="text-zinc-600">
					<HoverableItem
						targetBool={hoveredStat === 'unknown'}
						valueWhenNotHovered={selectedCountyInfo ? formatNumber(selectedCountyInfo.stats.pct.unknown * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber(selectedCountyInfo?.stats.raw.unknown)}
					/>
				</p>
			</ClickableListItem>
		</ScrollableList>
	</div>
</LawCard>
