<script lang="ts">
	import { formatNumber } from '$lib/utils';
	import type { County, Judge } from '$lib/types';
	import { selectedCountyStore } from '$lib/stores/data';
	import LawCard from '$lib/components/cards/LawCard.svelte';
	import ScrollableList from '$lib/components/shared/ScrollableList.svelte';
	import ClickableListItem from '$lib/components/shared/ClickableListItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import CloseButton from '$lib/components/shared/CloseButton.svelte';


	let county: County | null = null;
	let selectedJudgeInfo: Judge | null = null;
	let topJudges: Judge[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let hoveredStat: string | null = null;


	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}
</script>

<LawCard>
	<div slot="menuBar">
		<CloseButton store={selectedCountyStore} />
	</div>
	<h4 slot="super-title">Pretrial Data for</h4>

	<h2 slot="title">{$selectedCountyStore?.name} County</h2>
	<div slot="data">
		<ScrollableList>
			<ClickableListItem>
				<h3 slot="title">Number of cases:</h3>
				<p slot="stat" class="font-bold text-right text-zinc-400 font-mono">
					{$selectedCountyStore?.stats.caseCount}
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('amount')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				<p slot="stat">
					<Money
						value={$selectedCountyStore ? (hoveredStat === 'amount' ? $selectedCountyStore.stats.totalBailSet : $selectedCountyStore.stats.averageBailSet) : 0} />
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('remand')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}</h3>
				<p slot="stat" class="text-red-600">
					<HoverableItem
						targetBool={hoveredStat === 'remand'}
						valueWhenNotHovered={$selectedCountyStore ? formatNumber($selectedCountyStore.stats.pct.remand * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber($selectedCountyStore?.stats.raw.remand)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('release')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}</h3>
				<p slot="stat" class="text-green-600">
					<HoverableItem
						targetBool={hoveredStat === 'release'}
						valueWhenNotHovered={$selectedCountyStore ? formatNumber($selectedCountyStore.stats.pct.release * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber($selectedCountyStore?.stats.raw.release)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('bail')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}</h3>
				<p slot="stat" class="text-yellow-300">
					<HoverableItem
						targetBool={hoveredStat === 'bail'}
						valueWhenNotHovered={$selectedCountyStore ? formatNumber($selectedCountyStore.stats.pct.bailSet * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber($selectedCountyStore?.stats.raw.bailSet)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('unknown')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}</h3>
				<p slot="stat" class="text-zinc-600">
					<HoverableItem
						targetBool={hoveredStat === 'unknown'}
						valueWhenNotHovered={$selectedCountyStore ? formatNumber($selectedCountyStore.stats.pct.unknown * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber($selectedCountyStore?.stats.raw.unknown)}
					/>
				</p>
			</ClickableListItem>
		</ScrollableList>
	</div>
</LawCard>
