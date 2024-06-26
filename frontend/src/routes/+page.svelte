<script lang="ts">
	import type { County, Judge, GeoJSONData } from '$lib/types';
	import {
		bailMinMaxStore,
		bailAmountsStore,
		countyJudgesStore,
		allCountiesStore,
		loadingStore,
		selectedCountyStore,
		selectedMetricStore,
		geoJSONStore
	} from '$lib/stores/data';

	import {
		Map,
		CountyDetails,
		CountyJudges,
		JudgeDetails,
		Title,
		Footer,
		StateDetails,
		AllCountiesSelector,
		AllJudgesSelector,
		LawCard
	} from '$lib/components/index';
	import { fetchTopJudges } from '$lib/api';

	let selectedCountyInfo: County | null;
	let allCounties: County[] = [];
	let topJudgesArray: Judge[] = [];
	let bailAmountsArray: number[] = [];
	let bailMinMaxArray: [number, number] = [0, 0];
	let geoJson: GeoJSONData | null;
	let metric: 'bail' | 'remand' | 'release' = 'bail';

	$: selectedCountyInfo = $selectedCountyStore;
	$: if ($selectedCountyStore) fetchTopJudges($selectedCountyStore.name);
	$: topJudgesArray = $countyJudgesStore;
	$: bailAmountsArray = $bailAmountsStore;
	$: bailMinMaxArray = $bailMinMaxStore;
	$: allCounties = $allCountiesStore;
	$: geoJson = $geoJSONStore;
	$: metric = $selectedMetricStore;
	$: loading = $loadingStore;
</script>


{#if loading}
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
			<Map />
			<StateDetails />
			<AllJudgesSelector />
			<AllCountiesSelector />
			<CountyDetails />
			<CountyJudges />
			<JudgeDetails />
		</div>
		<div class="footer-container ">
			<Footer>
				© 2024 LawVision. All rights reserved.
			</Footer>
		</div>
	</div>
{/if}
