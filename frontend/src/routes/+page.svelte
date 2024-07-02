<script lang="ts">
	import AllJudgesSelector from '$lib/components/cards/AllJudgesSelector.svelte';
	import ChargeCard from '$lib/components/cards/ChargeCard.svelte';
	import CountiesSelector from '$lib/components/cards/CountiesSelector.svelte';
	import CountyDetails from '$lib/components/cards/CountyDetails.svelte';
	import CountyJudges from '$lib/components/cards/CountyJudges.svelte';
	import JudgeDetails from '$lib/components/cards/JudgeDetails.svelte';
	import Map from '$lib/components/cards/Map.svelte';
	import RaceCard from '$lib/components/cards/RaceCard.svelte';
	import StateDetails from '$lib/components/cards/StateDetails.svelte';
	import ContainerCounty from '$lib/components/containers/ContainerCounty.svelte';
	import ContainerJudge from '$lib/components/containers/ContainerJudge.svelte';
	import ContainerState from '$lib/components/containers/ContainerState.svelte';
	import SelectorContainer from '$lib/components/containers/SelectorContainerJudge.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	import Title from '$lib/components/shared/Title.svelte';
	import { loadingStore, selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';
	import { TypeOfTarget } from '$lib/types/frontendTypes';
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
		<!--		<MetricSelector />-->
		<div class="middle-container my-10 gap-2">
<!--			<ContainerJudge />-->
			<SelectorContainer targetType={TypeOfTarget.judges} />
<!--			<ContainerCounty />-->
<!--			<SelectorContainer targetType={TypeOfTarget.counties} />
			<ContainerState />-->
			<!--<Map />
			<StateDetails />
			<AllJudgesSelector />
			<CountiesSelector />
			&lt;!&ndash;{#if $selectedCountyStore}&ndash;&gt;
			<CountyDetails />
			&lt;!&ndash;{/if}&ndash;&gt;
			&lt;!&ndash;{#if $selectedCountyStore}&ndash;&gt;
			<CountyJudges />
			&lt;!&ndash;{/if}&ndash;&gt;
			&lt;!&ndash;{#if $selectedJudgeStore}&ndash;&gt;
			<JudgeDetails />
			<ChargeCard />
			<RaceCard />-->
			<!--{/if}-->
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
        @apply flex flex-wrap justify-center;
    }
</style>
