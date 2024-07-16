<script lang="ts">
	import CountyDropdown from '$lib/components/containers/CountyDropdown.svelte';
	import ContainerJudge from '$lib/components/judge-focus/ContainerJudge.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import {
		allCountiesStore,
		allJudgesStore,
		countyNameFilterStore,
		judgeNameFilterStore,
		selectedCountyStore,
		selectedJudgeStore
	} from '$lib/stores/data';
	import { type Judge, SortOrder, SortTarget } from '$lib/types/frontendTypes';
	import { formatNumber, sortListByTarget } from '$lib/utils';
	import { Button, Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';


	let judges: Judge[] = [];

	const sortTarget = writable<SortTarget>(SortTarget.caseCount);
	let sortTargetValue: SortTarget;
	$: sortTargetValue = $sortTarget;

	const sortOrder = writable<SortOrder>(SortOrder.desc);
	let sortedJudges: Judge[] = [];
	let counties: string[] = [];

	const updateVisibleJudges = () => {
		const windowInnerHeight = window.innerHeight;
		const clientHeight = document.querySelector('.sticky')?.clientHeight || 0;
		const availableHeight = windowInnerHeight - clientHeight - (clientHeight * 2.7);
		visibleJudgeCount = Math.floor(availableHeight / rowHeight);
	};

	const sortJudges = (
		inputJudges: Judge[],
		sortTargetValue: SortTarget,
		sortOrder: SortOrder,
		county: string
	): Judge[] => {
		let resultJudges = inputJudges;
		if (county) {
			resultJudges = resultJudges.filter(judge => judge.primaryCounty === county);
		}
		resultJudges = sortListByTarget(resultJudges, sortTargetValue, sortOrder) as Judge[];
		return resultJudges;
	};

	$: sortedJudges = sortJudges(
		judges,
		sortTargetValue,
		$sortOrder,
		$selectedCountyStore?.name || ''
	);
	$: counties = $allCountiesStore;

	const toggleSort = () => {
		sortOrder.update(order => order === SortOrder.asc ? SortOrder.desc : SortOrder.asc);
	};

	const handleClick = (target: SortTarget) => {
		if ($sortTarget === target) {
			toggleSort();
		} else {
			sortOrder.set(SortOrder.desc);
			sortTarget.set(target);
		}
	};

	const nextSortMetric = (): SortTarget => {
		selectedJudgeStore.set(null);
		switch ($sortTarget) {
			case SortTarget.name:
				return SortTarget.caseCount;
			case SortTarget.caseCount:
				return SortTarget.averageBail;
			case SortTarget.averageBail:
				return SortTarget.bailSet;
			case SortTarget.bailSet:
				return SortTarget.remandPct;
			case SortTarget.remandPct:
				return SortTarget.releasePct;
			case SortTarget.releasePct:
				return SortTarget.name;

			default:
				return SortTarget.caseCount;
		}
	};

	const filterJudges = (judges: Judge[], query: string, county: string) => {
		if (!query && !county) return judges;
		return judges.filter(judge =>
			(!query || judge.name.toLowerCase().includes(query.toLowerCase())) &&
			(!county || judge.primaryCounty === county)
		);
	};

	let searchTimeout: ReturnType<typeof setTimeout>;
	let query: string = '';
	$: judgeNameFilterStore.set(query);
	$: judges = filterJudges($allJudgesStore, $judgeNameFilterStore, $countyNameFilterStore || '');
	// $: countyNameFilterStore.set($selectedCountyStore?.name || '');

	const handleSearch = () => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			judges = filterJudges($allJudgesStore, $judgeNameFilterStore, $countyNameFilterStore || '');
		}, 150);
	};

	let judgeRangeStart: number = 0;
	let visibleJudgeCount: number = 10;
	const rowHeight = 50;

	const handlePrevious = () => {
		if (judgeRangeStart > 0) {
			judgeRangeStart -= visibleJudgeCount;
		}
	};

	const handleNext = () => {
		if (judgeRangeStart + visibleJudgeCount < sortedJudges.length) {
			judgeRangeStart += visibleJudgeCount;
		}
	};

	$: selectedCountyName = $selectedCountyStore?.name;

	onMount(() => {
		judges = $allJudgesStore.filter(judge => judge.arraignmentResults.Any.Any.totalCases > 9);
		updateVisibleJudges();
		window.addEventListener('resize', updateVisibleJudges);
	});

	$: sortedJudges = sortJudges(
		judges,
		sortTargetValue,
		$sortOrder,
		$selectedCountyStore?.name || ''
	);

</script>
<div class="grid grid-flow-row-dense bg-zinc-900 pb-1 pt-4">
	<!--JudgeTable-->
	<div class="px-8 space-y-4 sm:space-y-4">
		<div
			class="flex flex-row px-4 text-2xl grid-rows-1 h-fit sm:text-4xl w-3/5 sm:w-full font-bold items-baseline tracking-tight text-zinc-400 sm:px-6 lg:px-8">
			<h4 class="text-4xl text-zinc-500 w-full text-left sm:text-center">
				<span class="text-zinc-400">{selectedCountyName || "New York State"}</span> Judges
			</h4>
		</div>

		<div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 sm:w-full ">
			<div class="w-full">
				<CountyDropdown />
			</div>
			<div class="w-full flex flex-row space-x-4">
				<Input
					type="text"
					name="name"
					id="name"
					class="block h-12 w-full rounded-md border-0 bg-zinc-800 px-4 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 placeholder:opacity-25 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					placeholder={'Ruth B. Ginsburg'}
					bind:value={query}
					on:input={handleSearch}
				/>
				<Button
					type="button"
					class="{$judgeNameFilterStore === '' ? 'hidden' : ''} text-zinc-300 hover:text-gray-50 shadow outline outline-neutral-700 outline-[0.5px] bg-zinc-400/10 hover:bg-zinc-600/10 transition mr-4 px-4"
					on:click={() => {
						query = '';
						judgeNameFilterStore.set('');
					}}
				>
					Clear
				</Button>
			</div>
		</div>
		<div
			class="flex justify-end space-x-4 flex-row sm:items-end text-right text-zinc-500 text-2xl leading-7 tracking-tight">
			<div class="flex flex-col sm:items-end text-right text-zinc-500 text-2xl leading-7 tracking-tight">
				<h2 class="">sorted by</h2>
				<button
					class="flex cursor-pointer flex-row justify-end text-right font-semibold transition hover:opacity-75"
					on:click={() => handleClick(nextSortMetric())}
					class:remanded-color={sortTargetValue === SortTarget.remandPct}
					class:released-color={sortTargetValue === SortTarget.releasePct}
					class:bailSet-color={sortTargetValue === SortTarget.bailSet}
					class:averageBailAmount-color={sortTargetValue === SortTarget.averageBail}
					class:totalCases-color={sortTargetValue === SortTarget.caseCount || sortTargetValue === SortTarget.name}
				>
					{$sortTarget}
				</button>
			</div>
		</div>
	</div>

	<div class="w-full mt-6">
		<table class="w-full whitespace-nowrap text-left">
			<colgroup>
				<col class="w-16" />
				<col />
				<col />
				<col class="hidden md:table-cell" />
				<col class="hidden md:table-cell" />
				<col class="hidden md:table-cell" />
				<col class="hidden md:table-cell" />
			</colgroup>
			<thead class="sticky bg-zinc-900 text-base text-zinc-400">
			<tr>
				<th scope="col" class="py-2 pl-4 text-left font-semibold">#</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.name}
					on:click={() => handleClick(SortTarget.name)}
					scope="col"
					class="cursor-pointer py-2 pl-8 font-semibold pr-4"
				>Judge
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.caseCount}
					on:click={() => handleClick(SortTarget.caseCount)}
					scope="col"
					class="{$sortTarget === SortTarget.caseCount || $sortTarget === SortTarget.name ? 'table-cell' : 'hidden'} pr-4 text-right md:table-cell cursor-pointer py-2  font-semibold"
				>Total Cases
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.averageBail}
					on:click={() => handleClick(SortTarget.averageBail)}
					scope="col"
					class="{$sortTarget === SortTarget.averageBail ? 'table-cell' : 'hidden'} pr-4 text-right md:table-cell cursor-pointer py-2 font-semibold"
				>Average Bail
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.bailSet}
					on:click={() => handleClick(SortTarget.bailSet)}
					scope="col"
					class="{$sortTarget === SortTarget.bailSet ? 'table-cell' : 'hidden'} pr-4 text-right md:table-cell cursor-pointer py-2 font-semibold"
				>Bail-Set %
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.remandPct}
					on:click={() => handleClick(SortTarget.remandPct)}
					scope="col"
					class="{$sortTarget === SortTarget.remandPct ? 'table-cell' : 'hidden'} pr-4 text-right md:table-cell cursor-pointer py-2 font-semibold"
				>Remand %
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.releasePct}
					on:click={() => handleClick(SortTarget.releasePct)}
					scope="col"
					class="{$sortTarget === SortTarget.releasePct ? 'table-cell' : 'hidden'} pr-4 text-right md:table-cell cursor-pointer py-2 font-semibold"
				>Release %
				</th>
			</tr>
			</thead>
			<tbody class="divide-y divide-white/5 bg-zinc-800">
			{#each sortedJudges.slice(judgeRangeStart, judgeRangeStart + visibleJudgeCount) as judge, i}

				<tr
					class:bg-zinc-950={i % 2 === 0}
					class:bg-zinc-800={judge === $selectedJudgeStore}
					class="cursor-pointer font-medium text-zinc-400 hover:bg-gray-500/50 transition-all hover:font-bold hover:shadow-2xl  hover:text-white
							{judge === $selectedJudgeStore ? 'hidden' : ''}
							{$selectedJudgeStore && judge !== $selectedJudgeStore && 'blur-xs opacity-[15%] filter transition-all'}"
					on:click={() => {
							if ($selectedJudgeStore?.name === judge.name) {
								selectedJudgeStore.set(null);
							} else {
								selectedJudgeStore.set(judge);
							}
						}}
				>
					<td class="py-4 text-left font-mono pl-4">
						{judgeRangeStart + i + 1}
					</td>
					<td class="py-4 sm:pl-6 lg:pl-8">
						<div class="flex items-center gap-x-4">
							<div class="truncate text-lg leading-6 hover:text-gray-50">{judge?.name}</div>
						</div>
					</td>
					<td
						class="{$sortTarget === SortTarget.caseCount || $sortTarget === SortTarget.name ? 'table-cell' : 'hidden'} text-right pr-4 py-4 md:table-cell ">
						<div class="flex gap-x-3 justify-end">
							<div
								class="totalCases-color font-mono text-lg leading-6 {$sortTarget === SortTarget.caseCount ? 'font-bold' : ''}">
								{formatNumber(judge.arraignmentResults.Any.Any.totalCases)}
							</div>
						</div>
					</td>
					<td
						class="{$sortTarget === SortTarget.averageBail ? 'table-cell' : 'hidden'} pr-4 md:table-cell py-4 text-right text-sm leading-6 ">
						<div
							class="averageBailAmount-color hidden text-right font-mono text-lg sm:block {$sortTarget === SortTarget.averageBail ? 'font-bold' : ''}">
							<Money value={judge.arraignmentResults.Any.Any.bailSet.amount} />
						</div>
					</td>
					<td
						class="{$sortTarget === SortTarget.bailSet ? 'table-cell' : 'hidden'} bailSet-color py-4 pr-4 text-right font-mono text-lg leading-6 md:table-cell {$sortTarget === SortTarget.bailSet ? 'font-bold' : ''}">
						<Percent value={judge.arraignmentResults.Any.Any.bailSet.percent} />
					</td>
					<td
						class="{$sortTarget === SortTarget.remandPct ? 'table-cell' : 'hidden'} remanded-color py-4 pr-4 text-right font-mono text-lg leading-6 md:table-cell {$sortTarget === SortTarget.remandPct ? 'font-bold' : ''}">
						<Percent value={judge.arraignmentResults.Any.Any.remanded.percent} />
					</td>
					<td
						class="{$sortTarget === SortTarget.releasePct ? 'table-cell' : 'hidden'} released-color pr-4 py-4 text-right font-mono text-lg leading-6 md:table-cell {$sortTarget === SortTarget.releasePct ? 'font-bold' : ''}">
						<Percent value={judge.arraignmentResults.Any.Any.released.percent} />
					</td>
				</tr>

				{#if judge === $selectedJudgeStore}
					<tr>
						<td colspan="7" class="bg-black/50">
							<ContainerJudge in:slide={{ duration: 300 }} out:slide={{ duration: 300 }} />
						</td>
					</tr>
				{/if}
			{/each}
			</tbody>
		</table>
		<nav class="flex items-center justify-between border-t border-gray-700 bg-zinc-900 px-4 py-3 sm:px-6"
				 aria-label="Pagination">
			<div class="hidden sm:block">
				<p class="text-sm text-gray-400">
					Showing
					<span class="font-medium">{judgeRangeStart + 1}</span>
					to
					<span class="font-medium">{Math.min(judgeRangeStart + visibleJudgeCount, sortedJudges?.length)}</span>
					of
					<span class="font-medium">{sortedJudges?.length}</span>
					results
				</p>
			</div>
			<div class="flex flex-1 justify-between sm:justify-end">
				{#if judgeRangeStart > 0}
					<Button
						on:click={handlePrevious}
						class="transition relative inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-gray-200 ring-1 ring-inset ring-gray-300/30 hover:bg-gray-50/50 focus-visible:outline-offset-0">
						Previous
					</Button>
				{/if}
				{#if judgeRangeStart + visibleJudgeCount < sortedJudges.length}
					<Button
						on:click={handleNext}
						class="transition relative ml-3 inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-gray-200 ring-1 ring-inset ring-gray-300/30 hover:bg-gray-50/50 focus-visible:outline-offset-0">
						Next
					</Button>
				{/if}
			</div>
		</nav>
	</div>
</div>
