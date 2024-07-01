<script lang="ts">


	import LawContainer from '$lib/components/containers/LawContainer.svelte';
	import ChargeDetails from '$lib/components/details/ChargeDetails.svelte';
	import OverviewDetails from '$lib/components/details/OverviewDetails.svelte';
	import RaceDetails from '$lib/components/details/RaceDetails.svelte';
	import CloseButton from '$lib/components/shared/CloseButton.svelte';
</script>


<LawContainer>
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4">
			<CloseButton />
		</button>
	</div>

	<h4 class="text-xl tracking-tight font-bold text-gray-500 mb-1">The Honorable</h4>
	<h2 class="text-3xl font-semibold tracking-tight text-gray-50 mb-4">Judge Name</h2>

	<div class="flex flex-row">
		<OverviewDetails />
		<ChargeDetails />
		<RaceDetails />
	</div>
</LawContainer>


<style>


</style>
