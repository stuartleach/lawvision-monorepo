<script lang="ts">
	import type { CountyFeature, CountyProperties, JudgeProperties } from '$lib/types';
	import {
		bailMinMaxStore,
		bailAmountsStore,
		topJudgesStore,
		allCountiesStore,
		loadingStore,
		selectedCountyStore, selectedJudgeStore
	} from '$lib/stores/data';
	import Map from '$lib/components/Map.svelte';
	import CountyDetails from '$lib/components/CountyDetails.svelte';
	import JudgeDetails from '$lib/components/JudgeDetails.svelte';
	import Title from '$lib/components/Title.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getJudgesByCounty } from '$lib/api';
	import PieChart from '$lib/components/PieChart.svelte';

	let loading: boolean;
	let selectedCountyInfo: CountyProperties | null = {
		county_name: '',
		countyUuid: '',
		number_of_cases: 0,
		median_income: 0,
		average_bail_amount: 0,
		name: '',
		geoid: '',
		cases_set_bail: 0,
		cases_ror: 0,
		cases_remand: 0,
		cases_unknown: 0

	};
	let allCounties: CountyFeature[] = [];
	let bailMinMaxArray: [number, number] = [0, 0]; // Variable to hold the [min, max] array
	let topJudgesArray: JudgeProperties[] = [];
	let bailAmountsArray: number[] = [];

	$: loading = $loadingStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: $selectedCountyStore && fetchTopJudges($selectedCountyStore.name);
	$: topJudgesArray = $topJudgesStore;
	$: bailAmountsArray = $bailAmountsStore;
	$: bailMinMaxArray = $bailMinMaxStore;
	$: allCounties = $allCountiesStore;


	const fetchTopJudges = async (countyName: string) => {
		if (countyName) {
			try {
				const judges = await getJudgesByCounty(fetch, countyName, 10);
				topJudgesStore.set(judges);
			} catch (error) {
				console.error('Error fetching judges:', error);
			}
		} else {
			topJudgesStore.set([]);
		}
	};

</script>

{#if loading}
	<div class="loading">Loading...</div>
{:else}
	<section class="title-container">
		<Title>
			<h1 slot="title">New York Bail Averages by County</h1>
			<h2 slot="subtitle">Taking a look at bail data by county and judge.</h2>
		</Title>
	</section>
	<div class="inner-container">
		<div class="middle-container">
			<section class="map-container">
				<Map />
			</section>

			{#if $selectedCountyStore}
				<section class="details-container transition">
					<CountyDetails />
				</section>
			{/if}

			{#if $selectedJudgeStore}
				<section class="details-container transition">
					<JudgeDetails />
				</section>
			{/if}
			<div class="chart-container">
				<PieChart />
			</div>
		</div>
		<div class="footer-container ">
			<Footer>
				© 2024 LawVision. All rights reserved.
			</Footer>
		</div>
	</div>

{/if}

<style>
    /* Your styles here */
</style>
