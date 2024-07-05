<script lang="ts">
	import type { Judge } from '$lib/types';

	export let selectedJudgeInfo: Judge | null;
</script>

<div class="topRow flex-row flex justify-between border-b border-zinc-700 p-4 rounded-lg mb-4 rounded-b-none">
	<div>
		<h4 class="text-xl tracking-tight font-bold text-gray-500 mb-1">The Honorable</h4>
		<h2
			class="text-3xl font-semibold tracking-tight text-gray-50 mb-4">{selectedJudgeInfo?.name || "Honorable Judge"}</h2>
	</div>
	<h2 class="text-2xl tracking-tight text-gray-200 mb-4 font-sans font-semiboldbold">Trial Judge
		in <span
			class="bg-clip-text font-bold text-transparent bg-gradient-to-tr from-red-500 to-yellow-300"> {selectedJudgeInfo?.counties?.[0] || "County"}
			County</span>
	</h2>
</div>
