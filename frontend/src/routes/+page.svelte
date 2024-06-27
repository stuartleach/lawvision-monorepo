<script lang="ts">
	import {
		bailMinMaxStore,
		bailAmountsStore,
		countyJudgesStore,
		allCountiesStore,
		loadingStore,
		selectedCountyStore,
		selectedMetricStore,
		geoJSONStore
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
			<Row>
				<div class="flex-grow">
					<Map />
				</div>
				<StateDetails />
				<AllJudgesSelector />
				<CountiesSelector />
			</Row>
			<Row>
				<CountyDetails />
				<CountyJudges />
				<JudgeDetails />
			</Row>
			<!--				<RaceCard />-->
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
        /*@apply grid grid-flow-row-dense grid-cols-3 grid-rows-3 ;*/
        @apply w-[80vw] flex flex-col;
        /*@apply flex;*/
    }
</style>
