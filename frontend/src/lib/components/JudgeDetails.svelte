<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { Judge, RaceOutcomesMap } from '$lib/types/types';
	import { selectedCountyStore, selectedJudgeRaceOutcomesStore, selectedJudgeStore } from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';
	import ScrollableList from '$lib/components/ScrollableList.svelte';
	import ClickableListItem from '$lib/components/ClickableListItem.svelte';
	import { LawCard } from '$lib/components/index';
	import { setJudgeRaceOutcomes } from '$lib/api';
	import Money from '$lib/components/Money.svelte';
	import HoverableItem from '$lib/components/HoverableItem.svelte';

	let selectedJudgeInfo: Judge | null;

	$: selectedJudgeInfo = $selectedJudgeStore;

	let hoveredStat: string | null = null;

	const handleMouseEnter = (stat: string) => {
		hoveredStat = stat;
	};

	const handleMouseLeave = () => {
		hoveredStat = null;
	};

	$: judgeId = selectedJudgeInfo?.judgeUUID ?? '';

	const openRaceOutcomes = (judgeId: string | undefined) => {
		console.log('clicked!');
		if (!judgeId) return;
		console.log(judgeId);
		setJudgeRaceOutcomes({ fetch, judgeId });
	};

	let raceOutcomes: RaceOutcomesMap | null;
	$: raceOutcomes = $selectedJudgeRaceOutcomesStore;
</script>

<LawCard>
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => selectedJudgeStore.set(null)}>
			<Close />
		</button>
	</div>
	<h4
		class="text-xl tracking-tight font-bold text-gray-500 mb-1">{selectedJudgeInfo?.name ? "The Honorable Judge" : ""}</h4>
	<h2>{selectedJudgeInfo?.name || "The Honorable Judge X"}</h2>
	<div>
		<ScrollableList>
			<ClickableListItem onClick={() => openRaceOutcomes(selectedJudgeInfo?.judgeUUID)}>
				<h3 slot="title">Racial Breakdown</h3>
			</ClickableListItem>
			<ClickableListItem>
				<h3 slot="title">Total cases:</h3>
				<p
					class="font-bold text-right text-zinc-400 font-mono">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.caseCount) : '0'}</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('amount')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				<p slot="stat">
					<Money
						value={selectedJudgeInfo ? (hoveredStat === 'amount' ? selectedJudgeInfo.stats.totalBailSet : selectedJudgeInfo.stats.averageBailSet) : 0} />
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('remand')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}</h3>
				<p slot="stat" class="text-red-600">
					<HoverableItem
						targetBool={hoveredStat === 'remand'}
						valueWhenNotHovered={selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.pct.remand * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.remand)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('release')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}</h3>
				<p slot="stat" class="text-green-600">
					<HoverableItem
						targetBool={hoveredStat === 'release'}
						valueWhenNotHovered={selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.pct.release * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.release)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('bail')} onMouseLeave={handleMouseLeave}>
				<h3
					slot="title">{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}</h3>
				<p slot="stat" class="text-yellow-300">
					<HoverableItem
						targetBool={hoveredStat === 'bail'}
						valueWhenNotHovered={selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.pct.bailSet * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.bailSet)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('unknown')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}</h3>
				<p slot="stat" class="text-zinc-600">
					<HoverableItem
						targetBool={hoveredStat === 'unknown'}
						valueWhenNotHovered={selectedJudgeInfo ? formatNumber(selectedJudgeInfo.stats.pct.unknown * 100) + '%' : '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.unknown)}
					/>
				</p>
			</ClickableListItem>
		</ScrollableList>
	</div>
</LawCard>
