<script lang="ts">
	import LawContainer from '$lib/components/containers/LawContainer.svelte';
	import CloseButton from '$lib/components/shared/CloseButton.svelte';
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import { allJudgesStore, countyJudgesStore, selectedJudgeStore, stateBailCasesPct } from '$lib/stores/data';
	import { selectedCountyStore } from '$lib/stores/data.js';
	import { type Judge, SortTarget } from '$lib/types/frontendTypes';
	import { formatNumber, formatPercent } from '$lib/utils';

	let selectedJudgeInfo: Judge | null;

	$: selectedJudgeInfo = $selectedJudgeStore;

	let hoveredStat: string | null = null;

	const handleMouseEnter = (stat: string) => {
		hoveredStat = stat;
	};

	const handleMouseLeave = () => {
		hoveredStat = null;
	};

	$: judgeId = selectedJudgeInfo?.judgeUUID ?? '';


	function calculatePercentile(judges: Judge[], judge: Judge | null = $selectedJudgeStore, metric: 'bailSet' | 'remand' | 'release' = 'bailSet'): number {
		// Extract the values of the given metric for all judges
		console.log('metric: ', metric);
		const metricValues = judges.map(judge => judge?.stats?.pct?.[metric]);

		// Find the value of the metric for the given judge
		let valueForThisJudge = judge?.stats.pct?.[metric];

		// Sort the metric values in ascending order
		const sortedValues = metricValues.sort((a, b) => a - b);

		// Find the rank of the given judge's metric value
		const rank = sortedValues.indexOf(valueForThisJudge || 0) + 1;

		// Calculate the percentile rank
		return (rank / sortedValues.length) * 100;

	}


	let bailSetPercentile = calculatePercentile($countyJudgesStore ?? $allJudgesStore, selectedJudgeInfo, 'bailSet');
	let remandPercentile = calculatePercentile($countyJudgesStore ?? $allJudgesStore, selectedJudgeInfo, 'remand');
	let releasePercentile = calculatePercentile($countyJudgesStore ?? $allJudgesStore, selectedJudgeInfo, 'release');
	$: console.log('percentile: ', bailSetPercentile, remandPercentile, releasePercentile);


</script>


<!--<LawContainer>-->
<!--	<div class="flex justify-end">-->
<!--		<button class="x-button -mr-1 -mt-2 w-4">-->
<!--			<CloseButton />-->
<!--		</button>-->
<!--	</div>-->
<div class="">
	<h4 class="text-xl tracking-tight font-bold text-gray-500 mb-1">The Honorable</h4>
	<h2
		class="text-3xl font-semibold tracking-tight text-gray-50 mb-4">{selectedJudgeInfo ? selectedJudgeInfo.name : "Honorable Judge"}</h2>
</div>
<div class="flex flex-col">
	<div class="flex flex-row justify-center">
		<div class="flex ">
			<dl class="flex flex-row w-full ">
				<div class="bg-zinc-900">
					<div class="mx-auto max-w-7xl">
						<div class="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-5">
							<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
								<p class="text-sm font-medium leading-6 text-zinc-400">Total Cases</p>
								<p class="mt-2 flex items-baseline gap-x-2">
								<span
									class="text-4xl font-semibold tracking-tight text-white">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo?.stats.caseCount) : '1110'}</span>
								</p>
							</div>
							<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
								<p class="text-sm font-medium leading-6 text-zinc-400">Average Bail Amount</p>
								<p class="mt-2 flex items-baseline gap-x-2">
								<span class="text-4xl font-semibold tracking-tight text-white"><Money
									value={selectedJudgeInfo ? (hoveredStat === 'amount' ? selectedJudgeInfo.stats.totalBailSet : selectedJudgeInfo.stats.averageBailSet) : 0} /></span>
								</p>
							</div>
							<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
								<p
									class="text-sm font-medium leading-6 text-zinc-400">{hoveredStat === 'bail' ? 'Bail set total' : 'Bail Set Frequency'}</p>
								<p class="mt-2 flex items-baseline gap-x-2">
								<span class="text-4xl font-semibold tracking-tight text-white"><p class="text-red-600">
				<p slot="stat" class="text-yellow-300">
					<HoverableItem
						on:mouseenter={()=>handleMouseEnter('bail')}
						on:mouseleave={()=>handleMouseLeave}
						targetBool={hoveredStat === 'bail'}
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.bailSet)+ '%': '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.bailSet)}
					/>
				</p>
								</span>
								</p>
							</div>
							<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
								<p class="text-sm font-medium leading-6 text-zinc-400">Remand Frequency</p>
								<p class="mt-2 flex items-baseline gap-x-2">
								<span class="text-4xl font-semibold tracking-tight text-white"><p class="text-red-600">
					<HoverableItem
						targetBool={hoveredStat === 'remand'}
						on:mouseenter={()=>handleMouseEnter('remand')}
						on:mouseleave={()=>handleMouseLeave}
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.remand) + '%': '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.remand)}
					/>
								</span>
								</p>
							</div>
							<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
								<p class="text-sm font-medium leading-6 text-zinc-400">Release Frequency</p>
								<p class="mt-2 flex items-baseline gap-x-2">
								<span class="text-4xl font-semibold tracking-tight text-white"><p slot="stat" class="text-green-600">
					<HoverableItem
						targetBool={hoveredStat === 'release'}
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.release)+ '%': '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.release)}
					/>
				</p>
								</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</dl>

		</div>

	</div>
	<table class="mt-6 whitespace-nowrap text-left w-[65vw]">
		<colgroup>
			<col class="lg:w-1/12">
			<col class="lg:w-3/12">
			<col class="lg:w-2/12">
			<col class="lg:w-1/12">
			<col class="lg:w-1/12">
		</colgroup>
		<thead class="border-b border-white/10 text-sm leading-6 text-zinc-400">
		<tr>
			<th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8 text-left">Charge Weight</th>
			<th
				scope="col" class="cursor-pointer py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Total Cases
			</th>
			<th
				scope="col" class="cursor-pointer hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">Average Bail Amount
			</th>
			<th
				scope="col" class="cursor-pointer py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 lg:pr-20">
				Bail Set Frequency
			</th>
			<th
				scope="col" class="cursor-pointer hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">Remand
				Frequency
			</th>
			<th
				scope="col"
				class="cursor-pointer hidden py-2 pl-0 pr-4 text-left font-semibold sm:table-cell sm:pr-6 lg:pr-8">Release
				Frequency
			</th>
		</tr>
		</thead>
		<tbody class="divide-y divide-white/5">
		<!--{#each  as chargeWeight, index}-->
		<tr
			class="hover:bg-zinc-800 hover:text-white text-zinc-400 transition cursor-pointer">
			asdf
			<td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 text-left font-mono">
				lkjl
			</td>
			<td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
				<div class="flex items-center gap-x-4">
					<div class="truncate hover:text-gray-50 font-medium leading-6">asdf</div>
				</div>
			</td>

			<td class="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
				<div class="flex gap-x-3">
					<div class="font-mono text-sm leading-6">asdf</div>
				</div>
			</td>
			<td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
				<div class="flex items-center justify-end gap-x-2 sm:justify-start">
					<div class="hidden sm:block text-right font-semibold font-mono">
						<!--								<Money value={target.stats.averageBailSet} />-->asdf
					</div>
				</div>
			</td>

			<td
				class="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8 release-color font-mono">
				asdf
				<!--						<Percent value={target.stats.pct.release}></Percent>-->
			</td>
		</tr>
		<!--{/each}-->
		</tbody>
	</table>
</div>
<!--</LawContainer>-->


<style>


</style>
