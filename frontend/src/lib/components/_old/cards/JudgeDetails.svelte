<script lang="ts">
	import { getJudgeOutcomes } from '$lib/api';
	import LawCard from '$lib/components/_old/cards/LawCard.svelte';
	import ClickableListItem from '$lib/components/shared/ClickableListItem.svelte';
	import CloseButton from '$lib/components/shared/CloseButton.svelte';
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import ScrollableList from '$lib/components/shared/ScrollableList.svelte';
	import { selectedJudgeOutcomesStore, selectedJudgeStore } from '$lib/stores/data';
	import type { Judge, RaceOutcomesMap } from '$lib/types/frontendTypes';
	import { formatNumber, formatPercent } from '$lib/utils';


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
		if (!judgeId) return;
		getJudgeOutcomes({ fetch, judgeId });
	};

	let raceOutcomes: RaceOutcomesMap | null;
	$: raceOutcomes = $selectedJudgeOutcomesStore;
</script>

<LawCard>


	<div>
		<ScrollableList>
			<ClickableListItem>
				<h3 slot="title">Total cases:</h3>
				<p slot="stat">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo?.stats.caseCount) : '0'}</p>
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
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.remand): '0%'}
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
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.release): '0%'}
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
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.bailSet): '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.bailSet)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('unknown')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}</h3>
				<p slot="stat" class="text-zinc-600">
					<HoverableItem
						targetBool={hoveredStat === 'unknown'}
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.unknown): '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.unknown)}
					/>
				</p>
			</ClickableListItem>
		</ScrollableList>
	</div>
</LawCard>
