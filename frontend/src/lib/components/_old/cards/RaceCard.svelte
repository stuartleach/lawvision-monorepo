<script lang="ts">
	import LawCard from '$lib/components/_old/cards/LawCard.svelte';
	import ClickableListItem from '$lib/components/shared/ClickableListItem.svelte';
	import ScrollableList from '$lib/components/shared/ScrollableList.svelte';
	import { selectedJudgeOutcomesStore, selectedJudgeStore, selectedMetricStore } from '$lib/stores/data';
	import { formatPercent } from '$lib/utils';


	$: selectedJudgeInfo = $selectedJudgeStore;
	$: judgeOutcomes = $selectedJudgeOutcomesStore;


	$: console.log(judgeOutcomes?.charges);

</script>

<LawCard>

	<h4
		class="text-xl tracking-tight font-bold text-gray-500 mb-1">{"Racial Breakdown"}</h4>

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
