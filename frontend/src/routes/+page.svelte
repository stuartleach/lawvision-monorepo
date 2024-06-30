<script lang="ts">
	import {
		bailMinMaxStore,
		bailAmountsStore,
		countyJudgesStore,
		allCountiesStore,
		loadingStore,
		selectedCountyStore,
		selectedMetricStore,
		geoJSONStore, selectedJudgeStore
	} from '$data';

	import {
		Map,
		CountyDetails,
		CountyJudges,
		JudgeDetails,
		Title,
		Footer,
		StateDetails,
		CountiesSelector,
		AllJudgesSelector,
		LawCard,
		MetricSelector,
		RaceCard
	} from '$components';
	import Row from '$lib/components/Row.svelte';
	import BarPlot from '$lib/components/BarPlot.svelte';

</script>


{#if $loadingStore}
	<div class="loading">Loading...</div>
{:else}
	<section class="title-container">
		<Title>
			<h1 slot="title">New York Pretrial Data</h1>
			<h2 slot="subtitle">Taking a look at bail, remand, and release data by county and judge.</h2>
			<h3 slot="subtext">10/1/2020 - 9/1/2022</h3>
			<h4 slot="source"><a
				class="hover:text-white border-dashed border-zinc-500 border-b-2 hover:border-none pb-0.25 transition"
				target="_blank" href="https://ww2.nycourts.gov/pretrial-release-data-33136">Source</a></h4>
		</Title>
	</section>
	<div class="inner-container">
		<MetricSelector />
		<div class="middle-container mb-10">
				<Map />
			<StateDetails />
			<AllJudgesSelector />
			<CountiesSelector />
			{#if $selectedCountyStore}
				<CountyDetails />
			{/if}
			{#if $selectedCountyStore}
				<CountyJudges />
			{/if}
			{#if $selectedJudgeStore}
				<JudgeDetails />
			{/if}
		</div>
	</div>
	<div class="footer-container">
		<Footer>
			© 2024 LawVision. All rights reserved.
		</Footer>
	</div>
{/if}

<style>
    .middle-container {
        @apply w-[80vw] flex flex-wrap justify-center;
        /*@apply grid grid-cols-2 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4;*/
    }
</style>
