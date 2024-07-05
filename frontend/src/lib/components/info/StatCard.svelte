<script lang="ts">
	import Percentile from '$lib/components/shared/Percentile.svelte';

	export let title: string;
	export let judgeValue: number | undefined;
	export let countyValue: number | undefined;
	export let stateValue: number | undefined;
	console.log('StatCard', title, judgeValue, countyValue, stateValue);
</script>

<div class="px-4 py-6 sm:px-6 lg:px-8">
	<p class="text-sm font-medium leading-6 ">{title}</p>
	<p class="mt-2 flex items-baseline gap-x-2">
		<span class="text-4xl font-semibold tracking-tight text-white">{@html judgeValue}</span>
	</p>
	<div class="rank text-sm my-1 text-gray-500 font-sans tracking-tight">
		<div class="flex-col border-t pt-2 mt-2 border-dotted border-zinc-700">
			<h6 class=" text-left underline-offset-4 font-semibold tracking-normal pb-1 border-zinc-700">
				Percentile
			</h6>
			<div>
        <span class="text-gray-300 flex flex-row justify-between">
          <span class="text-left text-gray-500">County:</span>
          <span class="text-right">
            <Percentile value={countyValue} />
          </span>
        </span>
			</div>
			<div>
        <span class="text-gray-300 flex flex-row justify-between">
          <span class="text-left text-gray-500">State:</span>
          <span class="text-right">
            <Percentile value={stateValue} />
          </span>
        </span>
			</div>
		</div>
	</div>
</div>
