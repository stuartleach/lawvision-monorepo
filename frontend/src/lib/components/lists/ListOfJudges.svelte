<script lang="ts">
	import {
		allCountiesStore,
		allJudgesStore,
		currentListTargetStore,
		selectedCountyStore, selectedEntityStore,
		selectedJudgeStore,
		selectedMetricStore
	} from '$lib/stores/data';
	import { type County, type Judge, SortOrder, SortTarget } from '$lib/types/frontendTypes';
	import { sortListByTarget } from '$lib/utils';
	// let selectedJudgeInfo = $allJudgesStore[0];
	let judges = $allJudgesStore;
	let counties = $allCountiesStore;
	let county = $selectedCountyStore;
	let judge = $selectedJudgeStore;
	export const setStore = (store: 'judges' | 'counties', target: Judge | County) => {
		if (store === 'judges') {
			selectedJudgeStore.set(target as Judge);
		} else {
			selectedCountyStore.set(target as County);
		}
	};
$: selectedEntityStore.set($selectedJudgeStore || $selectedCountyStore);

	$: targetItems = $currentListTargetStore;
	let items = {
		judges: { name: 'Judges', targets: judges },
		counties: { name: 'Counties', targets: counties }
	};
	const numberOfJudgesInCounty = (county: County | null) => {
		if (!county) return judges.length;
		return judges.filter(judge => judge.primaryCounty === county.name).length;
	};
	$: console.log(numberOfJudgesInCounty($selectedCountyStore));
	$: entityList = sortListByTarget(items[targetItems].targets, SortTarget.bailSet, SortOrder.desc);

	// $: targetList = items[targetItems].targets.sort((a, b) => a.name?.localeCompare(b.name));

</script>

<div>
	<div class="sticky top-0 z-[1000000]">
		<div
			class=" top-0 z-[1000] bg-zinc-950 px-4 py-4 sm:px-6 lg:px-8 flex flex-row justify-between h-full align-bottom w-full">
			<h1
				class="text-2xl text-left tracking-[-.04em] bg-gradient-to-tr from-blue-500 to-blue-200 bg-clip-text font-bold text-transparent">
				Judges</h1>
			<div class="flex flex-col gap-1 text-right">
				<p class="text-zinc-500 text-sm align-bottom">showing
					<span
						class="text-left text-sm tracking-[-.04em] bg-gradient-to-tr from-blue-500 to-blue-300 bg-clip-text font-bold text-transparent">{$selectedCountyStore ? $selectedCountyStore.name + ' County' : 'all counties'}</span>
				</p>
				<p class="text-zinc-500 text-sm align-bottom">sorted by
					<span
						class="text-left text-sm tracking-[-.04em] bg-gradient-to-tr from-blue-500 to-blue-300 bg-clip-text font-bold text-transparent">{$selectedMetricStore ? $selectedMetricStore + ' ' : ''}</span>
				</p></div>
		</div>
	</div>
	<ul role="list" class=" divide-y divide-zinc-800/30">
		{#each entityList as entity}
			<li class="flex justify-between gap-x-4 py-5 cursor-pointer p-6 hover:bg-zinc-600"
					on:click={()=>setStore(targetItems, entity)}>
				<div class="flex min-w-0 gap-x-4">
					<div class="min-w-0 flex-auto flex-row justify-between">
						<p class="text-sm font-semibold leading-6 text-zinc-400">
							<span
								class="inset-x-0 -top-px bottom-0 text-lg {$selectedEntityStore === entity ? 'text-white' :''}">{entity.name}</span>
						</p>
						{#if targetItems === 'judges'}
							<p class="flex text-xs leading-5 text-gray-500">
								<a href="/"
									 class="relative truncate hover:underline">{entity?.primaryCounty || ""}</a>
							</p>
						{:else}
							<p class=" flex text-xs leading-5 text-gray-500">
								<a class="relative truncate hover:underline">{numberOfJudgesInCounty(entity)} judges</a>
							</p>
						{/if}
					</div>
				</div>
				<div class="flex self-center float-right">
					<svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd"
									d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
									clip-rule="evenodd" />
					</svg>
				</div>
			</li>
		{/each}
	</ul>
</div>
