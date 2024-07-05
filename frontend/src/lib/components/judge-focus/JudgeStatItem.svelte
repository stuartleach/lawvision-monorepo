<script lang="ts">
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import Percentile from '$lib/components/shared/Percentile.svelte';
	import { formatNumber, formatPercent } from '$lib/utils';

	export let label: string;
	export let value: number = 0;
	export let percentileCounty: number;
	export let percentileState: number;
	export let isHoverable = false;
	export let isMoney = false;
	export let hoveredStat: string | null = null;
	export let metric = 'bailSet';
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;

	const hoverKey = label.toLowerCase().replace(/ /g, '');
</script>

<div class="bg-zinc-950/50 rounded-md px-4 mx-2 py-6 sm:px-6 lg:px-8 grid-rows-2 grid">
	<div class="border-b text-white/50 border-dotted pb-4 text-center border-zinc-700 ">
		<p class="text-sm font-medium leading-6 ">{label}</p>
		<p class="mt-2 w-full px-4 py-3 bg-zinc-800/20 rounded">
    <span class="text-4xl font-semibold tracking-tight {metric}-color">
      {#if isHoverable}
        <HoverableItem
					on:mouseenter={() => handleMouseEnter(hoverKey)}
					on:mouseleave={handleMouseLeave}
					targetBool={hoveredStat === hoverKey}
					valueWhenNotHovered={formatPercent(value) + '%'}
					valueWhenHovered={formatNumber(value)}
				/>
      {:else if isMoney}
        <Money value={value} />
      {:else}
        {formatNumber(value)}
      {/if}
    </span>
		</p></div>

	<div class="rank text-sm text-zinc-400 font-sans tracking-tight">
		<div class="flex-col pt-2 mt-2  border-zinc-700">
			<h6 class="text-left underline-offset-4 font-semibold tracking-normal pb-1 border-zinc-700">
				Percentile
			</h6>
			<div>
        <span class="text-gray-300 flex flex-row justify-between">
          <span class="text-left text-gray-500">County:</span>
          <span class="text-right">
            <Percentile value={percentileCounty} />
          </span>
        </span>
			</div>
			<div>
        <span class="text-gray-300 flex flex-row justify-between">
          <span class="text-left text-gray-500">State:</span>
          <span class="text-right">
            <Percentile value={percentileState} />
          </span>
        </span>
			</div>
		</div>
	</div>
</div>
