<script lang="ts">
	import ContainerJudge from '$lib/components/judge-focus/ContainerJudge.svelte';
	import CountyDropdown from '$lib/components/containers/CountyDropdown.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import {
		allCountiesStore,
		allJudgesStore,
		selectedCountyStore,
		selectedJudgeStore
	} from '$lib/stores/data';
	import { type Judge, SortOrder, SortTarget } from '$lib/types/frontendTypes';
	import { formatNumber, sortListByTarget } from '$lib/utils';
	import { Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';

	let judges: Judge[] | never = [];

	onMount(() => {
		judges = get(allJudgesStore);
	});

	const sortTarget = writable<SortTarget>(SortTarget.caseCount);
	let sortTargetValue: SortTarget;
	$: sortTargetValue = $sortTarget;

	const sortOrder = writable<SortOrder>(SortOrder.desc);

	const sortAndFilterJudges = (
		inputJudges: Judge[],
		sortTargetValue: SortTarget,
		sortOrder: SortOrder,
		county: string
	): Judge[] => {
		let resultJudges: Judge[] = inputJudges;
		if (county) {
			resultJudges = inputJudges.filter((judge) => judge.counties?.includes(county));
		}
		resultJudges = sortListByTarget(resultJudges, sortTargetValue, sortOrder) as Judge[];
		return resultJudges;
	};

	$: sortedAndFilteredJudges = sortAndFilterJudges(
		judges,
		sortTargetValue,
		$sortOrder,
		$selectedCountyStore?.name as string
	);
	$: counties = $allCountiesStore;

	const toggleSort = () => {
		sortOrder.update((order) => (order === SortOrder.asc ? SortOrder.desc : SortOrder.asc));
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
				return SortTarget.remandPct;
			case SortTarget.remandPct:
				return SortTarget.releasePct;
			case SortTarget.releasePct:
				return SortTarget.name;
			default:
				return SortTarget.caseCount;
		}
	};

	const search = (query: string) => {
		const lowerQuery = query.toLowerCase();
		return sortedAndFilteredJudges.filter((judge) => judge.name.toLowerCase().includes(lowerQuery));
	};

	let searchTimeout: ReturnType<typeof setTimeout>;
	let query: string = '';
	const handleSearch = () => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			if (query === '') {
				judges = sortedAndFilteredJudges;
			} else {
				judges = search(query);
			}
		}, 150);
	};
</script>

<style>
    /* Add some styles to ensure the table container has a height and can scroll */
    .table-container {
        height: 100vh; /* Set this to whatever height you need */
        overflow-y: auto;
    }
</style>

<div class="grid bg-zinc-900 pb-5 pt-16">
	<div class="sticky z-[100] grid grid-flow-row-dense grid-cols-4">
		<div class="sticky grid px-4 text-4xl font-bold tracking-tight text-white sm:px-6 lg:px-8">
			<h4
				class="bg-gradient-to-bl from-red-700 to-yellow-500 bg-clip-text text-2xl leading-7 text-gray-500 text-transparent"
			>
				{$selectedCountyStore ? $selectedCountyStore.name : 'New York State'}
			</h4>
			<h2
				class="bg-gradient-to-bl from-red-700 to-yellow-500 bg-clip-text pb-2 text-left text-transparent transition"
			>
				Judges
			</h2>
		</div>

		<div class="z-[10000] mx-2">
			<CountyDropdown {counties} judges={sortedAndFilteredJudges} />
		</div>
		<div class="mx-2">
			<label for="name" class="ml-px block pl-4 font-medium leading-6 text-gray-900">Name</label>
			<Input
				type="text"
				name="name"
				id="name"
				class="block w-full rounded-md border-0 bg-zinc-800 px-4 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 placeholder:opacity-25 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				placeholder={'Ruth B. Ginsburg'}
				bind:value={query}
				on:input={handleSearch}
			/>
		</div>

		<div
			class="flex flex-col px-4 text-right text-2xl leading-7 tracking-tight text-zinc-500 sm:px-6 lg:px-8"
		>
			<h2 class="-mr-4 px-4 text-right text-2xl font-bold text-zinc-500">sorted by</h2>
			<button
				class="flex cursor-pointer flex-row justify-end text-right font-semibold transition hover:opacity-75"
				on:click={() => handleClick(nextSortMetric())}
				class:remand-color={sortTargetValue === SortTarget.remandPct}
				class:release-color={sortTargetValue === SortTarget.releasePct}
				class:bailSet-color={sortTargetValue === SortTarget.bailSet}
				class:averageBail-color={sortTargetValue === SortTarget.averageBail}
				class:caseCount-color={sortTargetValue === SortTarget.caseCount ||
					sortTargetValue === SortTarget.name}
			>
				{$sortTarget}
			</button>
		</div>
	</div>

	<div class="table-container mt-6 overflow-x-auto">
		<table class="mt-6 w-full whitespace-nowrap text-left">
			<colgroup>
				<col class="lg:w-1/12" />
				<col class="lg:w-3/12" />
				<col class="lg:w-2/12" />
				<col class="lg:w-1/12" />
				<col class="lg:w-1/12" />
				<col class="lg:w-1/12" />
			</colgroup>
			<thead class="sticky top-0 bg-zinc-900 text-base leading-6 text-zinc-400">
			<tr>
				<th scope="col" class="py-2 pl-4 pr-8 text-left font-semibold sm:pl-6 lg:pl-8">#</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.name}
					on:click={() => handleClick(SortTarget.name)}
					scope="col"
					class="cursor-pointer py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
				>Judge
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.caseCount}
					on:click={() => handleClick(SortTarget.caseCount)}
					scope="col"
					class="hidden cursor-pointer py-2 pl-0 pr-8 font-semibold sm:table-cell"
				>Total Cases
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.averageBail}
					on:click={() => handleClick(SortTarget.averageBail)}
					scope="col"
					class="cursor-pointer py-2 pl-0 pr-4 font-semibold sm:pr-8 lg:pr-20"
				>
					Average Bail
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.bailSet}
					on:click={() => handleClick(SortTarget.bailSet)}
					scope="col"
					class="hidden cursor-pointer py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
				>Bail-Set Percentage
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.remandPct}
					on:click={() => handleClick(SortTarget.remandPct)}
					scope="col"
					class="hidden cursor-pointer py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
				>Remand Percentage
				</th>
				<th
					class:text-zinc-200={$sortTarget === SortTarget.releasePct}
					on:click={() => handleClick(SortTarget.releasePct)}
					scope="col"
					class="hidden cursor-pointer py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
				>Release Percentage
				</th>
			</tr>
			</thead>
			<tbody class="divide-y divide-white/5 ">
			{#each sortedAndFilteredJudges as judge, i}
				<tr
					class:bg-zinc-950={i % 2 === 0}
					class:bg-zinc-800={judge === $selectedJudgeStore}
					class="cursor-pointer font-medium text-zinc-400 transition-all hover:bg-zinc-800 hover:font-bold hover:text-white
							{judge === $selectedJudgeStore ? 'outline outline-1 outline-zinc-500' : ''}
							{$selectedJudgeStore &&
								judge !== $selectedJudgeStore &&
								'blur-xs opacity-[15%] filter transition-all'}"
					on:click={() => {
								if ($selectedJudgeStore?.name === judge.name) {
									selectedJudgeStore.set(null);
								} else {
									selectedJudgeStore.set(judge);
								}
							}}
				>
					<td class="py-4 pl-4 pr-8 text-left font-mono sm:pl-6 lg:pl-8">
						{i + 1}
					</td>
					<td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
						<div class="flex items-center gap-x-4">
							<div class="truncate text-lg leading-6 hover:text-gray-50">{judge.name}</div>
						</div>
					</td>
					<td class="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
						<div class="flex gap-x-3">
							<div
								class="caseCount-color font-mono text-lg leading-6 {$sortTarget ===
										SortTarget.caseCount
											? 'font-bold'
											: ''}"
							>
								{formatNumber(judge.stats.caseCount)}
							</div>
						</div>
					</td>
					<td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
						<div class="flex items-center justify-end gap-x-2 sm:justify-start">
							<div
								class="averageBail-color hidden text-right font-mono text-lg sm:block {$sortTarget ===
										SortTarget.averageBail
											? 'font-bold'
											: ''}"
							>
								<Money value={judge.stats.averageBailSet} />
							</div>
						</div>
					</td>
					<td
						class="bailSet-color hidden py-4 pl-0 pr-8 text-right font-mono text-lg leading-6 md:table-cell lg:pr-20 {$sortTarget ===
								SortTarget.bailSet
									? 'font-bold'
									: ''}"
					>
						<Percent value={judge.stats.pct.bailSet} />
					</td>
					<td
						class="remand-color hidden py-4 pl-0 pr-8 text-right font-mono text-lg leading-6 md:table-cell lg:pr-20 {$sortTarget ===
								SortTarget.remandPct
									? 'font-bold'
									: ''}"
					>
						<Percent value={judge.stats.pct.remand} />
					</td>
					<td
						class="release-color hidden py-4 pl-0 pr-4 text-right font-mono text-lg leading-6 sm:table-cell sm:pr-6 lg:pr-8 {$sortTarget ===
								SortTarget.releasePct
									? 'font-bold'
									: ''}"
					>
						<Percent value={judge.stats.pct.release} />
					</td>
				</tr>
				{#if judge === $selectedJudgeStore}
					<tr>
						<td colspan="7" class="border-b-1 border-zinc-500 p-4">
							<ContainerJudge />
						</td>
					</tr>
				{/if}
			{/each}
			</tbody>
		</table>
	</div>
</div>
