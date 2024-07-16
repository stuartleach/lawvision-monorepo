<script lang="ts">
	import type { Judge } from '$lib/types';
	import { slide } from 'svelte/transition';

	export let selectedJudgeInfo: Judge | null;
</script>

<div
	class="flex sm:flex-row flex-col justify-between py-2" transition:slide={{ duration: 300, delay: 0 }}
>
	<!--	JudgeInfoHeader-->
	<div class="text-left sm:pl-5">
		<h4 class="mb-1 text-base hidden sm:block sm:text-xl font-bold tracking-tight text-gray-500">The Honorable</h4>
		<h2 class="mb-1 sm:text-6xl block sm:block text-xl font-semibold tracking-tight text-gray-50">
			{selectedJudgeInfo?.name || 'Honorable Judge'}
		</h2>
	</div>
	<h2
		class="font-semibold py-4 sm:mt-0 font-sans hidden sm:block text-4xl text-center sm:text-left sm:text-4xl tracking-tight text-gray-200 pr-5">
		Trial Judge in <span
		class="bg-gradient-to-tr from-red-500 to-yellow-300 bg-clip-text font-bold text-transparent"
	>
			{selectedJudgeInfo?.primaryCounty}
		County</span
	>
	</h2>
</div>
