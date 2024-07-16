<script lang="ts">
	import ChargesGrid from '$lib/components/judge-focus/ChargesGrid.svelte';
	import JudgeInfoHeader from '$lib/components/judge-focus/JudgeInfoHeader.svelte';
	import { selectedJudgeStore } from '$lib/stores/data';
	import { Button } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	$: selectedJudgeInfo = $selectedJudgeStore;
</script>

<div transition:slide class="border-white/30 border-t-2 border-b-2 shadow w-full py-10">
	<Button class="w-full *:w-full" on:click={()=>selectedJudgeStore.set(null)}>
		<JudgeInfoHeader {selectedJudgeInfo} />
	</Button>
	<ChargesGrid />
</div>
