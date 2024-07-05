<script lang="ts">
	import SelectorContainer from '$lib/components/containers/SelectorContainerJudge.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	import Title from '$lib/components/shared/Title.svelte';
	import { loadingStore } from '$lib/stores/data';
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
		<div class="middle-container my-10 gap-2">
			<SelectorContainer />
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
