<script lang="ts">
	import Percentile from '$lib/components/shared/Percentile.svelte';

	export let title: string;
	export let judgeValue: number | undefined;
	export let countyValue: number | undefined;
	export let stateValue: number | undefined;
</script>

<div class="px-4 py-6 sm:px-6 lg:px-8">
	<p class="text-sm font-medium leading-6">{title}</p>
	<p class="mt-2 flex items-baseline gap-x-2">
		<span class="text-4xl font-semibold tracking-tight text-white">{@html judgeValue}</span>
	</p>
	<div class="rank my-1 font-sans text-sm tracking-tight text-gray-500">
		<div class="mt-2 flex-col border-t border-dotted border-zinc-700 pt-2">
			<h6 class=" border-zinc-700 pb-1 text-left font-semibold tracking-normal underline-offset-4">
				Percentile
			</h6>
			<div>
				<span class="flex flex-row justify-between text-gray-300">
					<span class="text-left text-gray-500">County:</span>
					<span class="text-right">
						<Percentile value={countyValue} />
					</span>
				</span>
			</div>
			<div>
				<span class="flex flex-row justify-between text-gray-300">
					<span class="text-left text-gray-500">State:</span>
					<span class="text-right">
						<Percentile value={stateValue} />
					</span>
				</span>
			</div>
		</div>
	</div>
</div>
