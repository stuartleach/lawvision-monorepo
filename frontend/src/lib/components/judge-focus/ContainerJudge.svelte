<script lang="ts">
	import ChargesGrid from '$lib/components/judge-focus/ChargesGrid.svelte';
	import JudgeInfoHeader from '$lib/components/judge-focus/JudgeInfoHeader.svelte';
	import JudgeStatsGrid from '$lib/components/judge-focus/JudgeStatsGrid.svelte';
	import { selectedJudgeStore, severityLevels } from '$lib/stores/data';
	import { Button } from 'flowbite-svelte';

	$: selectedJudgeInfo = $selectedJudgeStore;
</script>

<div class="border-white/30 border-t-2 border-b-2 shadow w-full p-10">
	<Button class="w-full *:w-full" on:click={()=>selectedJudgeStore.set(null)}>
		<JudgeInfoHeader {selectedJudgeInfo} />
	</Button>

	<div class="justify-center">
		<!--	{#each severityLevels as severity}
				<JudgeStatsGrid
					severity={severity}
				/>
			{/each}-->
		<ChargesGrid />

	</div>
</div>
