<script lang="ts">
	import type { CountyFeature, CountyProperties, JudgeProperties } from '$lib/types';
	import {
		bailMinMaxStore,
		bailAmountsStore,
		countyJudgesStore,
		allCountiesStore,
		loadingStore,
		selectedCountyStore, selectedJudgeStore, showCountyJudgesStore, selectedMetricStore
	} from '$lib/stores/data';
	import Map from '$lib/components/Map.svelte';
	import CountyDetails from '$lib/components/CountyDetails.svelte';
	import CountyJudges from '$lib/components/CountyJudges.svelte';
	import JudgeDetails from '$lib/components/JudgeDetails.svelte';
	import Title from '$lib/components/Title.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getJudgesByCounty } from '$lib/api';
	import StateDetails from '$lib/components/StateDetails.svelte';
	import AllCountiesSelector from '$lib/components/AllCountiesSelector.svelte';
	import AllJudgesSelector from '$lib/components/AllJudgesSelector.svelte';
	import Container from '$lib/components/Container.svelte';
	import { Card } from 'flowbite-svelte';

	let loading: boolean;
	let selectedCountyInfo: CountyProperties | null = {
		county_name: '',
		countyUuid: '',
		number_of_cases: 0,
		median_income: 0,
		average_bail_set: 0,
		name: '',
		geoid: '',
		cases_bail_set: 0,
		cases_ror: 0,
		cases_remand: 0,
		cases_unknown: 0,
		cases_nmr: 0
	};

	let allCounties: CountyFeature[] = [];
	let bailMinMaxArray: [number, number] = [0, 0]; // Variable to hold the [min, max] array
	let topJudgesArray: JudgeProperties[] = [];
	let bailAmountsArray: number[] = [];

	$: loading = $loadingStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: $selectedCountyStore && fetchTopJudges($selectedCountyStore.name);
	$: topJudgesArray = $countyJudgesStore;
	$: bailAmountsArray = $bailAmountsStore;
	$: bailMinMaxArray = $bailMinMaxStore;
	$: allCounties = $allCountiesStore;
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	$: metric = $selectedMetricStore;


	const fetchTopJudges = async (countyName: string) => {
		if (countyName) {
			try {
				const judges = await getJudgesByCounty(fetch, countyName, 20);
				countyJudgesStore.set(judges);
			} catch (error) {
				console.error('Error fetching judges:', error);
			}
		} else {
			countyJudgesStore.set([]);
		}
	};

</script>

{#if loading}
	<div class="loading">Loading...</div>
{:else}
	<section class="title-container">
		<Title>
			<h1 slot="title">New York Pretrial Data</h1>
			<h2 slot="subtitle">Taking a look at bail, remand, and release data by county and judge.</h2>
			<h3 slot="subtext">10/1/2020 - 9/1/2022</h3>
		</Title>
	</section>
	<div class="inner-container">
		<div class="flex justify-center">
			<nav
				class="details-nav bg-neutral-900 rounded-lg py-1 flex flex-row w-[20vw] justify-self-center justify-between my-4">
				<button on:click={() => selectedMetricStore.set('bail')}
								class="text-md font-semibold tracking-tight text-yellow-400 {metric === 'bail' ? 'selected' : ''}">Bail
				</button>
				<button on:click={() => selectedMetricStore.set('release')}
								class="text-md font-semibold tracking-tight text-green-400 {metric === 'release' ? 'selected' : ''}">
					Release
				</button>
				<button on:click={() => selectedMetricStore.set('remand')}
								class="text-md font-semibold tracking-tight text-red-400 {metric === 'remand' ? 'selected' : ''}">Remand
				</button>
			</nav>
		</div>
		<div class="middle-container mb-10">
			<!--			<div class="flex-col flex h-full">-->
			<section class="sub-middle details-container transition">
				<StateDetails />
			</section>
			<section class="sub-middle details-container transition">
				<AllJudgesSelector />
			</section>
			<!--			</div>-->

			<section class="sub-middle map-container">
				<Map />
			</section>

			<section class="sub-middle details-container transition h-full">
				<AllCountiesSelector />
			</section>

			{#if $selectedCountyStore}
				<!--				<div class="sub-middle flex-col flex flex-1 self-baseline">-->
				<section class="sub-middle details-container transition">
					<CountyDetails />
				</section>
				<!--				</div>-->
			{/if}


			{#if $selectedJudgeStore}

				<section class="sub-middle details-container transition">
					<CountyJudges />
				</section>

				<section class="sub-middle details-container transition">
					<JudgeDetails />
				</section>
			{/if}


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
