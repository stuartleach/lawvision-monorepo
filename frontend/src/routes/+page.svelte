<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { CountyFeature, CountyProperties, JudgeProperties } from '$lib/types';
	import {
		bailMinMaxStore,
		bailAmountsStore,
		topJudgesStore,
		allCountiesStore,
		loadingStore,
		selectedCountyStore
	} from '$lib/stores/data';
	import Map from '$lib/components/Map.svelte';
	import CountyDetails from '$lib/components/CountyDetails.svelte';
	import JudgeDetails from '$lib/components/JudgeDetails.svelte';
	import Title from '$lib/components/Title.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getJudgesByCounty } from '$lib/api';

	let loading: boolean;
	let selectedCountyInfo: CountyProperties | null = {
		county_name: '',
		countyUuid: '',
		number_of_cases: 0,
		median_income: 0,
		average_bail_amount: 0,
		name: '',
		geoid: ''
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
				console.log('Fetching judges for county:', countyName);
				const judges = await getJudgesByCounty(fetch, countyName, 10);
				console.log('Judges:', judges);
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
		<section class="map-container">
			<Map />
		</section>
		<section class="details-container">
			<CountyDetails />
			<JudgeDetails />
		</section>
	</div>
	<div class="footer-container">
		<Footer>
			© 2024 LawVision. All rights reserved.
		</Footer>
	</div>
{/if}

<style>
    /* Your styles here */
</style>
