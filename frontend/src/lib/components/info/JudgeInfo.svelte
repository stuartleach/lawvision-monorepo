<script lang="ts">
	import { selectedJudgeStore } from '$lib/stores/data';
	import type { Judge } from '$lib/types/frontendTypes';

	let selectedJudgeInfo: Judge | null = null;

	$: selectedJudgeInfo = $selectedJudgeStore;
</script>

<div class="topRow flex flex-row justify-between">
	<div>
		<h4 class="mb-1 text-xl font-bold tracking-tight text-gray-500">The Honorable</h4>
		<h2 class="mb-4 text-3xl font-semibold tracking-tight text-gray-50">
			{selectedJudgeInfo ? selectedJudgeInfo.name : 'Honorable Judge'}
		</h2>
	</div>
	<h2 class="mb-4 font-sans text-2xl font-semibold tracking-tight text-gray-200">
		Trial Judge in
		<span
			class="bg-gradient-to-tr from-red-500 to-yellow-300 bg-clip-text font-bold text-transparent"
		>
			{$selectedJudgeStore?.counties?.[0]} County
		</span>
	</h2>
</div>
