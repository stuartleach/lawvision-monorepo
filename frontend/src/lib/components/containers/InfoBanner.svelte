<script lang="ts">
	import DownChevron from '$lib/components/assets/DownChevron.svelte';
	import UpChevron from '$lib/components/assets/UpChevron.svelte';
	import { Button } from 'flowbite-svelte';
	import { sineIn, sineOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	// 1. Reactive `bannerIsVisible`
	let bannerIsVisible = true;

	// 2. Function to toggle the banner's visibility
	function toggleBanner() {
		bannerIsVisible = !bannerIsVisible;
	}


</script>

<div class="flex items-center justify-between w-full bg-zinc-950/70 px-6 py-2 sm:pr-3.5 lg:pl-8">
	{#if bannerIsVisible}
		<div>
			<div class="text-sm text-zinc-400 leading-6 flex-1">
				<p>This data is sourced from <a class="text-zinc-50 underline underline-offset-3"
																				href="https://ww2.nycourts.gov/pretrial-release-data-33136">nycourts.gov</a> and
					is updated biannually. The latest cases are from <span class="text-zinc-50">2023</span>, and the earliest cases are from <span class="text-zinc-50">October 2020</span>.
				</p>
			</div>

		</div>
	{/if}

	<!--	<Button on:click={toggleBanner} type="button"-->
	<!--					class="ml-auto flex items-center p-3 focus-visible:outline-offset-[-4px]">-->
	<!--		{#if bannerIsVisible}-->
	<!--			<UpChevron />-->
	<!--		{:else}-->
	<!--			<DownChevron />-->
	<!--		{/if}-->
	<!--	</Button>-->
</div>
