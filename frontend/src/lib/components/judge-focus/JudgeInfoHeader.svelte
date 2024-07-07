<script lang="ts">
	import type { Judge } from '$lib/types';

	export let selectedJudgeInfo: Judge | null;
</script>

<div
	class="mb-4 flex sm:flex-row flex-col justify-between rounded-lg rounded-b-none border-b border-zinc-700 pb-1 sm:p-4"
>
	<div>
		<h4 class="mb-1 text-base hidden sm:block sm:text-xl font-bold tracking-tight text-gray-500">The Honorable</h4>
		<h2 class="mb-4 sm:text-3xl hidden sm:block text-xl font-semibold tracking-tight text-gray-50">
			{selectedJudgeInfo?.name || 'Honorable Judge'}
		</h2>
	</div>
	<h2 class="font-semiboldbold sm:mb-4 -mt-2 py-2 sm:mt-0 font-sans text-2xl text-center sm:text-left sm:text-2xl tracking-tight text-gray-200">
		Trial Judge in <span
			class="bg-gradient-to-tr from-red-500 to-yellow-300 bg-clip-text font-bold text-transparent"
		>
			{selectedJudgeInfo?.counties?.[0] || 'County'}
			County</span
		>
	</h2>
</div>
