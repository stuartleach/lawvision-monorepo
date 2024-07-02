<script lang="ts">
	import LawContainer from '$lib/components/containers/LawContainer.svelte';
	import CloseButton from '$lib/components/shared/CloseButton.svelte';
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import { selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';
	import { type County, type Judge } from '$lib/types/frontendTypes';
	import { formatNumber, formatPercent } from '$lib/utils';

	let selectedJudgeInfo: Judge | null;

	let selectedCountyInfo: County | null;

	$: selectedJudgeInfo = $selectedJudgeStore;
	$: selectedCountyInfo = $selectedCountyStore;

	let hoveredStat: string | null = null;

	const handleMouseEnter = (stat: string) => {
		hoveredStat = stat;
	};

	const handleMouseLeave = () => {
		hoveredStat = null;
	};

	$: judgeId = selectedJudgeInfo?.judgeUUID ?? '';

</script>


<LawContainer>
	<div class="flex justify-end">
		<button class="x-button -mr-1 -mt-2 w-4">
			<CloseButton />
		</button>
	</div>

	<div class="flex flex-col">
		<div class="w-1/6"><h4 class="text-xl tracking-tight font-bold text-gray-500 mb-1">New York's</h4>
			<h2
				class="text-3xl font-semibold tracking-tight text-gray-50 mb-4">{selectedCountyInfo ? selectedCountyInfo.name : "Blank County"}</h2>
		</div>

		<div class="flex flex-row w-full justify-center">
			<div class="bg-zinc-900 flex justify-center w-full">
				<div class="mx-auto justify-items-stretch flex max-w-7xl">
					<div class="grid gap-px bg-white/5 grid-cols-5">
						<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
							<p class="text-sm font-medium leading-6 text-zinc-400">Total Cases</p>
							<p class="mt-2 flex items-baseline gap-x-2">
								<span
									class="text-4xl font-semibold tracking-tight text-white">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo?.stats.caseCount) : '1110'}</span>
							</p>
						</div>
						<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
							<p class="text-sm font-medium leading-6 text-zinc-400">Average bail amount</p>
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
						targetBool={hoveredStat === 'bail'}
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.bailSet): '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.bailSet)}
					/>
				</p>
								</span>
							</p>
						</div>

						<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
							<p class="text-sm font-medium leading-6 text-zinc-400">Release Frequency:</p>
							<p class="mt-2 flex items-baseline gap-x-2">
								<span class="text-4xl font-semibold tracking-tight text-white"><p slot="stat" class="text-green-600">
					<HoverableItem
						targetBool={hoveredStat === 'release'}
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.release): '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.release)}
					/>
				</p>
								</span>
							</p>
						</div>
						<div class="bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
							<p class="text-sm font-medium leading-6 text-zinc-400">Remand Frequency:</p>
							<p class="mt-2 flex items-baseline gap-x-2">
								<span class="text-4xl font-semibold tracking-tight text-white"><p class="text-red-600">
					<HoverableItem
						targetBool={hoveredStat === 'remand'}
						valueWhenNotHovered={selectedJudgeInfo ? formatPercent(selectedJudgeInfo.stats.pct.remand): '0%'}
						valueWhenHovered={formatNumber(selectedJudgeInfo?.stats.raw.remand)}
					/>
								</span>
							</p>
						</div>
					</div>
				</div>
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
				<th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8 text-left">#</th>
				<th
					scope="col" class="cursor-pointer py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Judge
				</th>
				<th
					scope="col" class="cursor-pointer hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">Total Cases
				</th>
				<th
					scope="col" class="cursor-pointer py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 lg:pr-20">
					Average Bail
				</th>
				<th
					scope="col" class="cursor-pointer hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">Remand
					Percentage
				</th>
				<th
					scope="col"
					class="cursor-pointer hidden py-2 pl-0 pr-4 text-left font-semibold sm:table-cell sm:pr-6 lg:pr-8">Release
					Percentage
				</th>
			</tr>
			</thead>
			<tbody class="divide-y divide-white/5">

			<tr
				class="hover:bg-zinc-800 hover:text-white text-zinc-400 transition cursor-pointer">
				<td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 text-left font-mono">

				</td>
				<td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
					<div class="flex items-center gap-x-4">
						<div class="truncate hover:text-gray-50 font-medium leading-6"></div>
					</div>
				</td>
				<td class="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
					<div class="flex gap-x-3">
						<div class="font-mono text-sm leading-6"></div>
					</div>
				</td>
				<td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
					<div class="flex items-center justify-end gap-x-2 sm:justify-start">
						<div class="hidden sm:block text-right font-semibold font-mono">
							<!--								<Money value={target.stats.averageBailSet} />-->
						</div>
					</div>
				</td>
				<td class="hidden py-4 pl-0 pr-8 text-sm leading-6 md:table-cell lg:pr-20 text-right remand-color font-mono">
					<!--						<Percent value={target.stats.pct.remand} />-->
				</td>
				<td
					class="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8 release-color font-mono">
					<!--						<Percent value={target.stats.pct.release}></Percent>-->
				</td>
			</tr>

			</tbody>
		</table>
		<!--		<OverviewDetails />-->
		<!--		<ChargeDetails />-->
		<!--		<RaceDetails />-->
	</div>
</LawContainer>


<style>


</style>
