<script lang="ts">
	import { getJudgeOutcomes } from '$lib/api';
	import LawCard from '$lib/components/_old/cards/LawCard.svelte';
	import { selectedJudgeOutcomesStore, selectedJudgeStore, selectedMetricStore } from '$lib/stores/data';
	import type { CombinedPreTrialOutcomes, Judge, JudgeOutcomes } from '$lib/types/frontendTypes';
	import { formatPercent } from '$lib/utils';
	import ClickableListItem from '../../shared/ClickableListItem.svelte';
	import ScrollableList from '../../shared/ScrollableList.svelte';

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

	$: $selectedJudgeStore?.judgeUUID && getJudgeOutcomes({ fetch: fetch, judgeId: $selectedJudgeStore.judgeUUID });

	$: console.log(judgeOutcomes?.charges);

</script>

<LawCard>
	<div>
		<ScrollableList>
			<ClickableListItem>
				<h3 slot="title">A Felony:</h3>
				<p slot="stat"
					 class:bail-color={$selectedMetricStore === "bail"}
					 class:remand-color={$selectedMetricStore === "remand"}
					 class:release-color={$selectedMetricStore === "release"}
				>
					{#if $selectedMetricStore === "bail"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.AF.pct.bail) : 'Loading...'}
					{:else if $selectedMetricStore === "remand"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.AF.pct.remand) : 'Loading...'}
					{:else if $selectedMetricStore === "release"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.AF.pct.release) : 'Loading...'}
					{/if}
				</p>
			</ClickableListItem>
			<ClickableListItem>
				<h3 slot="title">B Felony:</h3>
				<p slot="stat"
					 class:bail-color={$selectedMetricStore === "bail"}
					 class:remand-color={$selectedMetricStore === "remand"}
					 class:release-color={$selectedMetricStore === "release"}
				>
					{#if $selectedMetricStore === "bail"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.BF.pct.bail) : 'Loading...'}
					{:else if $selectedMetricStore === "remand"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.BF.pct.remand) : 'Loading...'}
					{:else if $selectedMetricStore === "release"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.BF.pct.release) : 'Loading...'}
					{/if}

				</p>
			</ClickableListItem>
			<ClickableListItem>

				<h3 slot="title">C Felony:</h3>
				<p slot="stat"
					 class:bail-color={$selectedMetricStore === "bail"}
					 class:remand-color={$selectedMetricStore === "remand"}
					 class:release-color={$selectedMetricStore === "release"}
				>
					{#if $selectedMetricStore === "bail"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.CF.pct.bail) : 'Loading...'}
					{:else if $selectedMetricStore === "remand"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.CF.pct.remand) : 'Loading...'}
					{:else if $selectedMetricStore === "release"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.CF.pct.release) : 'Loading...'}
					{/if}

				</p>
			</ClickableListItem>
			<ClickableListItem>

				<h3 slot="title">D Felony:</h3>
				<p slot="stat"
					 class:bail-color={$selectedMetricStore === "bail"}
					 class:remand-color={$selectedMetricStore === "remand"}
					 class:release-color={$selectedMetricStore === "release"}
				>
					{#if $selectedMetricStore === "bail"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.DF.pct.bail) : 'Loading...'}
					{:else if $selectedMetricStore === "remand"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.DF.pct.remand) : 'Loading...'}
					{:else if $selectedMetricStore === "release"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.DF.pct.release) : 'Loading...'}
					{/if}

				</p>
			</ClickableListItem>
			<ClickableListItem>

				<h3 slot="title">E Felony:</h3>
				<p slot="stat"
					 class:bail-color={$selectedMetricStore === "bail"}
					 class:remand-color={$selectedMetricStore === "remand"}
					 class:release-color={$selectedMetricStore === "release"}
				>
					{#if $selectedMetricStore === "bail"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.EF.pct.bail) : 'Loading...'}
					{:else if $selectedMetricStore === "remand"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.EF.pct.remand) : 'Loading...'}
					{:else if $selectedMetricStore === "release"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.EF.pct.release) : 'Loading...'}
					{/if}

				</p>
			</ClickableListItem>
			<ClickableListItem>
				<h3 slot="title">A Misdemeanor:</h3>
				<p slot="stat"
					 class:bail-color={$selectedMetricStore === "bail"}
					 class:remand-color={$selectedMetricStore === "remand"}
					 class:release-color={$selectedMetricStore === "release"}
				>
					{#if $selectedMetricStore === "bail"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.AM.pct.bail) : 'Loading...'}
					{:else if $selectedMetricStore === "remand"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.AM.pct.remand) : 'Loading...'}
					{:else if $selectedMetricStore === "release"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.AM.pct.release) : 'Loading...'}
					{/if}
				</p>
			</ClickableListItem>
			<ClickableListItem>
				<h3 slot="title">B Misdemeanor:</h3>
				<p slot="stat"
					 class:bail-color={$selectedMetricStore === "bail"}
					 class:remand-color={$selectedMetricStore === "remand"}
					 class:release-color={$selectedMetricStore === "release"}
				>
					{#if $selectedMetricStore === "bail"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.BM.pct.bail) : 'Loading...'}
					{:else if $selectedMetricStore === "remand"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.BM.pct.remand) : 'Loading...'}
					{:else if $selectedMetricStore === "release"}
						{judgeOutcomes?.charges ? formatPercent(judgeOutcomes.charges.BM.pct.release) : 'Loading...'}
					{/if}
				</p>
			</ClickableListItem>
		</ScrollableList>
	</div>
</LawCard>
