<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { Judge } from '$lib/types/types';
	import { selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';
	import ScrollableList from '$lib/components/ScrollableList.svelte';
	import CustomListItem from '$lib/components/CustomListItem.svelte';
	import { LawCard } from '$lib/components/index';

	let selectedJudgeInfo: Judge | null;

	$: selectedJudgeInfo = $selectedJudgeStore;

	let hoveredStat: string | null = null;

	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}

</script>

<LawCard>
	<div class=" flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => selectedJudgeStore.set(null)}>
			<Close />
		</button>
	</div>
	<h4
		class="text-xl tracking-tight font-bold text-gray-500 mb-1">{selectedJudgeInfo?.name ? "The Honorable Judge" : ""}</h4>
	<h2>{selectedJudgeInfo?.name || "The Honorable Judge X"}</h2>
	<div>
		<ScrollableList>
			<CustomListItem>
				<h3 class="text-lg text-zinc-300 font-bold">Total cases:</h3>
				<p
					class="font-bold text-right text-zinc-400 font-mono">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.caseCount) : '0'}</p>
			</CustomListItem>
			<CustomListItem class="stat" mouseenter={() => handleMouseEnter('amount')} mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				<div class="right text-right">
					<div class="money flex-row text-right">
						<span class="text-green-600">$</span>
						<span
							class="font-bold text-white font-mono">{selectedJudgeInfo ? formatMoney(hoveredStat === 'amount' ? selectedJudgeInfo.stats.totalBailSet : selectedJudgeInfo.stats.averageBailSet).split('.')[0] : '0'}</span>&nbsp;<span
						class="super font-mono">.{selectedJudgeInfo ? formatMoney(selectedJudgeInfo.stats.averageBailSet).split('.')[1] : '00'}</span>
					</div>
				</div>
			</CustomListItem>
			<CustomListItem class="stat" mouseenter={() => handleMouseEnter('remand')} mouseleave={handleMouseLeave}>
				<h3
					class="text-lg text-zinc-300 font-bold">{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}</h3>
				<p class="font-bold font-mono text-right text-red-600">
					{hoveredStat === 'remand' ? formatNumber(selectedJudgeInfo?.stats.raw.remand) : (selectedJudgeInfo ? formatNumber((selectedJudgeInfo.stats.pct.remand) * 100) + '%' : '0%')}
				</p>
			</CustomListItem>
			<CustomListItem class="stat" mouseenter={() => handleMouseEnter('release')} mouseleave={handleMouseLeave}>
				<h3
					class="text-lg text-zinc-300 font-bold">{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}</h3>
				<p class="font-bold font-mono text-right text-green-600">
					{hoveredStat === 'release' ? formatNumber(Number(selectedJudgeInfo?.stats.raw.release)) : (selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.pct.release * 100) + '%' : '0%')}
				</p>
			</CustomListItem>
			<CustomListItem class="stat" mouseenter={() => handleMouseEnter('bail')} mouseleave={handleMouseLeave}>
				<h3
					class="text-lg text-zinc-300 font-bold">{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}</h3>
				<p class="font-bold font-mono text-right text-yellow-300">
					{hoveredStat === 'bail' ? formatNumber(selectedJudgeInfo?.stats.raw.bailSet) : (selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.pct.bailSet * 100) + '%' : '0%')}
				</p>
			</CustomListItem>
			<CustomListItem class="stat" mouseenter={() => handleMouseEnter('unknown')} mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}</h3>
				<p class="font-bold font-mono text-right text-zinc-600">
					{hoveredStat === 'unknown' ? formatNumber(selectedJudgeInfo?.stats.raw.unknown) : (selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.pct.unknown * 100) + '%' : '0%')}
				</p>
			</CustomListItem>
		</ScrollableList>
	</div>
</LawCard>

