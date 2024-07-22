<script lang="ts">
	import ChargesGrid from '$lib/components/entity-focus/ChargesGrid.svelte';
	import JudgeInfoHeader from '$lib/components/entity-focus/EntityInfoHeader.svelte';
	import { selectedJudgeStore } from '$lib/stores/data';
	import { Button } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	$: selectedJudgeInfo = $selectedJudgeStore;
</script>

<div transition:slide class="border-white/30 border-t-2 border-b-2 shadow w-full ">
	<Button class="w-full *:w-full" on:click={()=>selectedJudgeStore.set(null)}>
		<div class="py-10">
			<JudgeInfoHeader />
		</div>
	</Button>
	<div class="">
		<ChargesGrid />
	</div>
</div>
