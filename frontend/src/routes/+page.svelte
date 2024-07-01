<script lang="ts">
	import ContainerJudge from '$lib/components/containers/ContainerJudge.svelte';
	import { loadingStore, selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';

	import Title from '$lib/components/shared/Title.svelte';
	import MetricSelector from '$lib/components/shared/MetricSelector.svelte';
	import StateDetails from '$lib/components/cards/StateDetails.svelte';
	import Map from '$lib/components/cards/Map.svelte';
	import AllJudgesSelector from '$lib/components/cards/AllJudgesSelector.svelte';
	import CountiesSelector from '$lib/components/cards/CountiesSelector.svelte';
	import CountyDetails from '$lib/components/cards/CountyDetails.svelte';
	import CountyJudges from '$lib/components/cards/CountyJudges.svelte';
	import JudgeDetails from '$lib/components/cards/JudgeDetails.svelte';
	import ChargeCard from '$lib/components/cards/ChargeCard.svelte';
	import RaceCard from '$lib/components/cards/RaceCard.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
</script>


{#if $loadingStore}
	<div class="loading">Loading...</div>
{:else}
	<section class="title-container">
		<Title>
			<h1 slot="title">New York Pretrial Data</h1>
			<h2 slot="subtit tle">Taking a look at bail, remand, and release data by county and judge.</h2>
			<h3 slot="subtext">10/1/2020 - 9/1/2022</h3>
			<h4 slot="source"><a
				class="hover:text-white border-dashed border-zinc-500 border-b-2 hover:border-none pb-0.25 transition"
				target="_blank" href="https://ww2.nycourts.gov/pretrial-release-data-33136">Source</a></h4>
		</Title>
	</section>
	<div class="inner-container">
		<MetricSelector />
		<div class="middle-container mb-10">
			<ContainerJudge></ContainerJudge>
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
				<ChargeCard />
				<RaceCard />
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
    }
</style>
