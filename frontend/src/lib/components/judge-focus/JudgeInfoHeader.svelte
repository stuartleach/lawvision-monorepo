<script lang="ts">
	import type { Judge } from '$lib/types';

	export let selectedJudgeInfo: Judge | null;
</script>

<div
	class="topRow mb-4 flex flex-row justify-between rounded-lg rounded-b-none border-b border-zinc-700 p-4"
>
	<div>
		<h4 class="mb-1 text-xl font-bold tracking-tight text-gray-500">The Honorable</h4>
		<h2 class="mb-4 text-3xl font-semibold tracking-tight text-gray-50">
			{selectedJudgeInfo?.name || 'Honorable Judge'}
		</h2>
	</div>
	<h2 class="font-semiboldbold mb-4 font-sans text-2xl tracking-tight text-gray-200">
		Trial Judge in <span
			class="bg-gradient-to-tr from-red-500 to-yellow-300 bg-clip-text font-bold text-transparent"
		>
			{selectedJudgeInfo?.counties?.[0] || 'County'}
			County</span
		>
	</h2>
</div>
