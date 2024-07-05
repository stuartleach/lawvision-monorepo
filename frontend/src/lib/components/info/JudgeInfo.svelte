<script lang="ts">
	import { selectedJudgeStore } from '$lib/stores/data';
	import type { Judge } from '$lib/types/frontendTypes';

	let selectedJudgeInfo: Judge | null = null;

	$: selectedJudgeInfo = $selectedJudgeStore;
</script>

<div class="topRow flex-row flex justify-between">
	<div>
		<h4 class="text-xl tracking-tight font-bold text-gray-500 mb-1">The Honorable</h4>
		<h2 class="text-3xl font-semibold tracking-tight text-gray-50 mb-4">
			{selectedJudgeInfo ? selectedJudgeInfo.name : "Honorable Judge"}
		</h2>
	</div>
	<h2 class="text-2xl tracking-tight text-gray-200 mb-4 font-sans font-semibold">
		Trial Judge in
		<span class="bg-clip-text font-bold text-transparent bg-gradient-to-tr from-red-500 to-yellow-300">
      {$selectedJudgeStore?.counties?.[0]} County
    </span>
	</h2>
</div>
