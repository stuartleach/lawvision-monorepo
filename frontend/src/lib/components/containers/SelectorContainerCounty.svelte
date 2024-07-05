<script lang="ts">
	import CountyDropdown from '$lib/components/containers/CountyDropdown.svelte';
	import Paginator from '$lib/components/containers/Paginator.svelte';
	import ContainerJudge from '$lib/components/judge-focus/ContainerJudge.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import {
		allCountiesStore,
		allJudgesStore,
		selectedCountyStore,
		selectedJudgeStore
	} from '$lib/stores/data';
	import {
		type JudgeOrCounty,
		SortOrder,
		SortTarget,
		TypeOfTarget
	} from '$lib/types/frontendTypes';
	import { formatNumber } from '$lib/utils';
	import { Input } from 'flowbite-svelte';
	import { get, writable } from 'svelte/store';

	export let targetType: TypeOfTarget = TypeOfTarget.counties;

	$: targets = targetType === TypeOfTarget.counties ? get(allCountiesStore) : get(allJudgesStore);

	const sortTarget = writable<SortTarget>(SortTarget.caseCount);
	let sortTargetValue: SortTarget;
	$: sortTargetValue = $sortTarget;

	const sortOrder = writable<SortOrder>(SortOrder.desc);
	const currentPage = writable(1);
	const itemsPerPage = 10;

	$: sortedTargets = sortListByTarget(targets, sortTargetValue, $sortOrder);

	const resetPage = () => {
		currentPage.set(1);
	};

	const nextPage = () => {
		if ($currentPage < totalPages()) {
			currentPage.update((n) => n + 1);
		}
	};

	const prevPage = () => {
		if ($currentPage > 1) {
			currentPage.update((n) => n - 1);
		}
	};

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
		resetPage();
	};

	const sortListByTarget = (
		list: JudgeOrCounty[],
		target: SortTarget,
		order: SortOrder = SortOrder.desc
	) => {
		selectedJudgeStore.set(null);
		selectedCountyStore.set(null);
		const compareValues = (a: JudgeOrCounty, b: JudgeOrCounty) => {
			switch (target) {
				case SortTarget.remandPct:
					return a.stats.pct.remand - b.stats.pct.remand;
				case SortTarget.releasePct:
					return a.stats.pct.release - b.stats.pct.release;
				case SortTarget.averageBail:
					return a.stats.averageBailSet - b.stats.averageBailSet;
				case SortTarget.caseCount:
					return a.stats.caseCount - b.stats.caseCount;
				case SortTarget.remandRaw:
					return a.stats.raw.remand - b.stats.raw.remand;
				case SortTarget.releaseRaw:
					return a.stats.raw.release - b.stats.raw.release;
				case SortTarget.bailSet:
					return a.stats.raw.bailSet - b.stats.raw.bailSet;
				case SortTarget.name:
					return a.name.localeCompare(b.name);
				default:
					return 0;
			}
		};

		return list.sort((a, b) =>
			order === SortOrder.asc ? compareValues(a, b) : compareValues(b, a)
		);
	};

	const totalPages = () => Math.ceil(sortedTargets.length / itemsPerPage);

	const setPage = (page: number) => {
		if (page > 0 && page <= totalPages()) {
			selectedJudgeStore.set(null);
			selectedCountyStore.set(null);
			currentPage.set(page);
		}
	};

	const nextSortMetric = (): SortTarget => {
		selectedJudgeStore.set(null);
		selectedCountyStore.set(null);
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

	const getPageNumbers = () => {
		const total = totalPages();
		const current = $currentPage;
		const delta = 5;
		let start = Math.max(1, current - delta);
		let end = Math.min(total, current + delta);

		if (current <= delta) {
			end = Math.min(total, 10);
		} else if (current + delta >= total) {
			start = Math.max(1, total - 9);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const search = (query: string) => {
		const lowerQuery = query.toLowerCase();
		if (targetType === TypeOfTarget.counties) {
			targets = get(allCountiesStore).filter((county) =>
				county.name.toLowerCase().includes(lowerQuery)
			);
		} else {
			targets = get(allJudgesStore).filter((judge) =>
				judge.name.toLowerCase().includes(lowerQuery)
			);
		}
		resetPage();
	};

	let query: string = '';
	const handleSearch = () => {
		selectedJudgeStore.set(null);
		selectedCountyStore.set(null);
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			if (query === '') {
				targets =
					targetType === TypeOfTarget.counties ? get(allCountiesStore) : get(allJudgesStore);
			}
			search(query);
		}, 150);
	};

	const toggleType = () => {
		selectedJudgeStore.set(null);
		selectedCountyStore.set(null);
		targetType = targetType === TypeOfTarget.counties ? TypeOfTarget.judges : TypeOfTarget.counties;
		resetPage();
	};

	let searchTimeout: NodeJS.Timeout;

	let props = {
		currentPage,
		totalPages,
		prevPage,
		setPage,
		getPageNumbers,
		nextPage
	};
</script>

<div class="inline-grid rounded-lg bg-zinc-900 py-16 pb-5">
	<div class="grid grid-flow-row-dense grid-cols-3">
		<div class="grid px-4 text-4xl font-bold tracking-tight text-white sm:px-6 lg:px-8">
			<h4 class="text-2xl leading-7 text-gray-500">
				{$selectedCountyStore ? $selectedCountyStore.name : 'New York State'}
			</h4>
			<button on:click={toggleType} class="text-left transition hover:text-zinc-400">
				{targetType === TypeOfTarget.counties ? ' Counties' : ' Judges'}
			</button>
		</div>
		<div class="grid">
			<CountyDropdown />
			<label for="name" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900"
				>Name</label
			>
			<div class="mt-2">
				<Input
					type="text"
					name="name"
					id="name"
					class="block w-full rounded-md border-0 bg-zinc-800 px-4 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 placeholder:opacity-25 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					placeholder={targetType === TypeOfTarget.judges ? 'Ruth B. Ginsburg' : 'Suffolk County'}
					bind:value={query}
					on:input={handleSearch}
				/>
			</div>
		</div>
		<div
			class="flex flex-col px-4 text-right text-2xl leading-7 tracking-tight text-zinc-500 sm:px-6 lg:px-8"
		>
			<h2 class="-mr-4 px-4 text-right text-2xl font-bold text-zinc-500">sorted by</h2>
			<button
				class="flex cursor-pointer flex-row justify-end text-right font-semibold transition hover:opacity-75"
				on:click={() => handleClick(nextSortMetric())}
				class:text-red-700={sortTargetValue === SortTarget.remandPct}
				class:text-green-700={sortTargetValue === SortTarget.releasePct}
				class:text-yellow-500={sortTargetValue === SortTarget.averageBail}
				class:text-zinc-400={sortTargetValue === SortTarget.caseCount ||
					sortTargetValue === SortTarget.name}
			>
				{$sortTarget}
			</button>
		</div>
	</div>
	<table class="mt-6 w-[65vw] whitespace-nowrap text-left">
		<colgroup>
			<col class="lg:w-1/12" />
			<col class="lg:w-3/12" />
			<col class="lg:w-2/12" />
			<col class="lg:w-2/12" />
			<col class="lg:w-1/12" />
		</colgroup>
		<thead class="border-b border-white/10 text-sm leading-6 text-zinc-400">
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
		<tbody class="divide-y divide-white/5">
			{#each sortedTargets.slice(($currentPage - 1) * itemsPerPage, $currentPage * itemsPerPage) as target, i}
				<tr
					class:bg-zinc-950={i % 2 === 0}
					class:bg-zinc-800={target === $selectedJudgeStore}
					class="cursor-pointer text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white
{target === $selectedJudgeStore ? 'scale-[101%] outline outline-1 outline-zinc-500' : ''}
{($selectedJudgeStore || $selectedCountyStore) &&
						target !== $selectedJudgeStore &&
						'blur-xs opacity-[15%] filter transition-all'}
"
					on:click={() => {
						$selectedJudgeStore?.name === target.name
							? selectedJudgeStore.set(null)
							: selectedJudgeStore.set(target);
					}}
				>
					<td class="py-4 pl-4 pr-8 text-left font-mono sm:pl-6 lg:pl-8">
						{($currentPage - 1) * itemsPerPage + i + 1}
					</td>
					<td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
						<div class="flex items-center gap-x-4">
							<div class="truncate font-medium leading-6 hover:text-gray-50">{target.name}</div>
						</div>
					</td>
					<td class="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
						<div class="flex gap-x-3">
							<div class="font-mono text-sm leading-6">{formatNumber(target.stats.caseCount)}</div>
						</div>
					</td>
					<td class="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
						<div class="flex items-center justify-end gap-x-2 sm:justify-start">
							<div class="hidden text-right font-mono font-semibold sm:block">
								<Money value={target.stats.averageBailSet} />
							</div>
						</div>
					</td>
					<td
						class="remand-color hidden py-4 pl-0 pr-8 text-right font-mono text-sm leading-6 md:table-cell lg:pr-20"
					>
						<Percent value={target.stats.pct.remand} />
					</td>
					<td
						class="release-color hidden py-4 pl-0 pr-4 text-right font-mono text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8"
					>
						<Percent value={target.stats.pct.release} />
					</td>
				</tr>
				{#if target === $selectedJudgeStore}
					<tr>
						<td colspan="6" class="border-b-4 border-zinc-500 p-4">
							<ContainerJudge />
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
	<Paginator
		currentPage={$currentPage}
		{totalPages}
		{prevPage}
		{nextPage}
		{setPage}
		{getPageNumbers}
	></Paginator>
</div>
