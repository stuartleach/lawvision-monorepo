<script lang="ts">
	import CourtLogo from '$lib/components/assets/CourtLogo.svelte';
	import GavelLogo from '$lib/components/assets/GavelLogo.svelte';
	import ShareLogo from '$lib/components/assets/ShareLogo.svelte';
	import StateLogo from '$lib/components/assets/StateLogo.svelte';
	import { currentPageStore } from '$lib/stores/data';

	let logos = {
		counties: { name: 'Counties', logo: CourtLogo },
		state: { name: 'State of NY', logo: StateLogo },
		judges: { name: 'Judges', logo: GavelLogo },
		contact: { name: 'Contact', logo: ShareLogo }
	};
	export let itemType: keyof typeof logos = 'judges';
	export let selectPage: (page: keyof typeof logos) => void;
</script>
<div class="mx-4 my-1">
	<li
		class="flex flex-row w-full h-18 rounded transition-all">
		<a on:click={()=>selectPage(itemType)} href="/"
			 class="  hover:bg-blue-400 transition group flex gap-x-3 rounded-md w-full py-3 px-6 text-sm font-semibold leading-6
 {itemType === $currentPageStore
 ? ' bg-gradient-to-tr rounded from-blue-300/10 to-blue-500/20 shadow  text-white fill-white '
 : '*:fill-zinc-300'}">
			{#if itemType === 'counties'}
				<CourtLogo class="h-10 w-10" />
			{:else if itemType === 'state'}
				<StateLogo class="h-10 w-10" />
			{:else if itemType === 'judges'}
				<GavelLogo class="h-10 w-10" />
			{:else if itemType === 'contact'}
				<ShareLogo class="h-10 w-10" />
			{/if}
			<div class="flex flex-col justify-center ">
				<h2 class="justify-self-end text-right w-full text-5xl sm:text-xl">
					{logos[itemType].name}
				</h2>
			</div>
		</a>
	</li>
</div>
<style>
    /* Add any necessary styling here */
</style>
