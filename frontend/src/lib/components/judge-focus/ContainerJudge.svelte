<script lang="ts">
	import ChargesGrid from '$lib/components/judge-focus/ChargesGrid.svelte';
	import JudgeInfoHeader from '$lib/components/judge-focus/JudgeInfoHeader.svelte';
	import { selectedJudgeStore } from '$lib/stores/data';
	import { Button } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	$: selectedJudgeInfo = $selectedJudgeStore;
</script>

<div transition:slide class="border-white/30 border-t-2 border-b-2 shadow w-full ">
	<Button  class="w-full *:w-full" on:click={()=>selectedJudgeStore.set(null)}>
		<div class="py-10" transition:slide>
		<JudgeInfoHeader {selectedJudgeInfo} />
			</div>
	</Button>
	<ChargesGrid />
</div>
