<script lang="ts">
	import type { County, Judge } from '$lib/types';

	export let entity: Judge | County | null;
</script>

<div
	class="flex sm:flex-row flex-col justify-between py-2"
>
	<div class="text-left sm:pl-5">
		{#if entity?.primaryCounty}
			<h4 class="mb-1 text-base hidden sm:block sm:text-xl font-bold tracking-tight text-gray-500">
				{entity ? 'The Honorable' : ''}
			</h4>
		{/if}
		<h2 class="mb-1 sm:text-2xl block sm:block text-xl font-semibold tracking-tight text-gray-50">
			{entity?.name || ''}
		</h2>
	</div>
	{#if entity?.primaryCounty}
		<h2
			class="font-semibold py-4 sm:mt-0 font-sans hidden sm:block text-4xl text-center sm:text-left sm:text-4xl tracking-tight text-gray-200 pr-5">
			{entity ? ' Trial Judge in ' : ''} <span
			class="bg-gradient-to-tr from-blue-500 to-blue-300 bg-clip-text font-bold text-transparent"
		>
				{entity ? entity?.primaryCounty + ' County' : ''}
			</span>
		</h2>
	{/if}
</div>
