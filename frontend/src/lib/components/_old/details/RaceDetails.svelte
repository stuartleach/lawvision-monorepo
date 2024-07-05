<script lang="ts">
	import LawCard from '$lib/components/_old/cards/LawCard.svelte';
	import ClickableListItem from '$lib/components/shared/ClickableListItem.svelte';
	import CloseButton from '$lib/components/shared/CloseButton.svelte';
	import ScrollableList from '$lib/components/shared/ScrollableList.svelte';
	import { selectedJudgeOutcomesStore, selectedJudgeStore, selectedMetricStore } from '$lib/stores/data';
	import type { CombinedPreTrialOutcomes, Judge, JudgeOutcomes } from '$lib/types/frontendTypes';
	import { formatPercent } from '$lib/utils';

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
	let judgeOutcomes: JudgeOutcomes | null;
	$: judgeOutcomes = $selectedJudgeOutcomesStore;
	let raceOutcomes: CombinedPreTrialOutcomes | null;


	$: console.log(judgeOutcomes?.charges);

</script>

<LawCard>

	<ScrollableList>
		<ClickableListItem>
			<h3 slot="title">White:</h3>
			<p slot="stat"
				 class:bail-color={$selectedMetricStore === "bail"}
				 class:remand-color={$selectedMetricStore === "remand"}
				 class:release-color={$selectedMetricStore === "release"}
			>
				{#if $selectedMetricStore === "bail"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races.White.pct.bail) : 'Loading...'}
				{:else if $selectedMetricStore === "remand"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races.White.pct.remand) : 'Loading...'}
				{:else if $selectedMetricStore === "release"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races.White.pct.release) : 'Loading...'}
				{/if}
			</p>
		</ClickableListItem>
		<ClickableListItem>
			<h3 slot="title">Black:</h3>
			<p slot="stat"
				 class:bail-color={$selectedMetricStore === "bail"}
				 class:remand-color={$selectedMetricStore === "remand"}
				 class:release-color={$selectedMetricStore === "release"}
			>
				{#if $selectedMetricStore === "bail"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races.Black.pct.bail) : 'Loading...'}
				{:else if $selectedMetricStore === "remand"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races.Black.pct.remand) : 'Loading...'}
				{:else if $selectedMetricStore === "release"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races.Black.pct.release) : 'Loading...'}
				{/if}
			</p>
		</ClickableListItem>
		<ClickableListItem>
			<h3 slot="title">American Indian / Alaska Native:</h3>
			<p slot="stat"
				 class:bail-color={$selectedMetricStore === "bail"}
				 class:remand-color={$selectedMetricStore === "remand"}
				 class:release-color={$selectedMetricStore === "release"}
			>
				{#if $selectedMetricStore === "bail"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races['American Indian/Alaska Native'].pct.bail) : 'Loading...'}
				{:else if $selectedMetricStore === "remand"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races['American Indian/Alaska Native'].pct.remand) : 'Loading...'}
				{:else if $selectedMetricStore === "release"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races['American Indian/Alaska Native'].pct.release) : 'Loading...'}
				{/if}
			</p>
		</ClickableListItem>
		<ClickableListItem>
			<h3 slot="title">Asian / Pacific Islander:</h3>
			<p slot="stat"
				 class:bail-color={$selectedMetricStore === "bail"}
				 class:remand-color={$selectedMetricStore === "remand"}
				 class:release-color={$selectedMetricStore === "release"}
			>
				{#if $selectedMetricStore === "bail"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races['Asian/Pacific Islander'].pct.bail) : 'Loading...'}
				{:else if $selectedMetricStore === "remand"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races['Asian/Pacific Islander'].pct.remand) : 'Loading...'}
				{:else if $selectedMetricStore === "release"}
					{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.races['Asian/Pacific Islander'].pct.release) : 'Loading...'}
				{/if}
			</p>
		</ClickableListItem>
	</ScrollableList>
</LawCard>
