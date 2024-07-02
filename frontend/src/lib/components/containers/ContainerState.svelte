<script lang="ts">
	import LawContainer from '$lib/components/containers/LawContainer.svelte';
	import CloseButton from '$lib/components/shared/CloseButton.svelte';
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import { selectedJudgeStore } from '$lib/stores/data';
	import type { Judge } from '$lib/types';
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

</script>


<LawContainer>
	<div class="flex justify-end">
		<button class="x-button -mr-1 -mt-2 w-4">
			<CloseButton />
		</button>
	</div>

	<div class="flex flex-row">
		<div>
			<h4 class="text-xl tracking-tight font-bold text-gray-500 mb-1">The Honorable</h4>
			<h2
				class="text-3xl font-semibold tracking-tight text-gray-50 mb-4">{selectedJudgeInfo ? selectedJudgeInfo.name : "Honorable Judge"}</h2>
		</div>

		<div class="flex flex-row w-full">
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
						<div class="bg-zinc-900 rounded-br-lg rounded-tr-lg px-4 py-6 sm:px-6 lg:px-8">
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
					</div>
				</div>
			</div>
		</div>

		<!--		<OverviewDetails />-->
		<!--		<ChargeDetails />-->
		<!--		<RaceDetails />-->
	</div>
</LawContainer>


<style>


</style>
