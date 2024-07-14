<script lang="ts">
	import JudgeInfoHeader from '$lib/components/judge-focus/JudgeInfoHeader.svelte';
	import JudgeStatsGrid from '$lib/components/judge-focus/JudgeStatsGrid.svelte';
	import { selectedJudgeStore, severityLevels } from '$lib/stores/data';

	$: selectedJudgeInfo = $selectedJudgeStore;
</script>

<div>
	<JudgeInfoHeader {selectedJudgeInfo} />
	<div class="justify-center">
		{#each severityLevels as severity}
			<JudgeStatsGrid
				severity={severity}
			/>
		{/each}
	</div>
</div>
