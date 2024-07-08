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

<div class="mx-2 grid grid-rows-2 sm:rounded-none sm:first:rounded-bl-2xl last:rounded-br-2xl [&:nth-last-child(2)]:rounded-bl-2xl sm:[&:nth-last-child(2)]:rounded-none bg-zinc-950/50 w-full justify-center px-6 py-6 sm:px-6 lg:px-8">
	<div class="border-b border-dotted border-zinc-700 w-full pb-4 text-center text-white/50">
		<p class="text-sm font-medium leading-6">{label}</p>
		<p class="mt-2 w-full rounded px-4 py-3">
			<span class="text-4xl font-semibold tracking-tight -mx-4 px-4 {metric}-color">
				{#if isHoverable}
					<HoverableItem
						on:mouseenter={() => handleMouseEnter(hoverKey)}
						on:mouseleave={handleMouseLeave}
						targetBool={hoveredStat === hoverKey}
						valueWhenNotHovered={formatPercent(value) + '%'}
						valueWhenHovered={formatNumber(value)}
					/>
				{:else if isMoney}
					<Money {value} />
				{:else}
					{formatNumber(value)}
				{/if}
			</span>
		</p>
	</div>

	<div class="rank font-sans text-sm tracking-tight text-zinc-400 px-4">
		<div class="mt-2 flex-col border-zinc-700 pt-2">
			<h6 class="border-zinc-700 pb-1 text-left font-semibold tracking-normal underline-offset-4">
				Percentile
			</h6>
			<div>
				<span class="flex flex-row justify-between text-gray-300">
					<span class="text-left text-gray-500">County:</span>
					<span class="text-right">
						<Percentile value={percentileCounty} />
					</span>
				</span>
			</div>
			<div>
				<span class="flex flex-row justify-between text-gray-300">
					<span class="text-left text-gray-500">State:</span>
					<span class="text-right">
						<Percentile value={percentileState} />
					</span>
				</span>
			</div>
		</div>
	</div>
</div>
