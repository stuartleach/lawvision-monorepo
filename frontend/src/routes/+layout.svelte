<script lang="ts">
	import '../app.css';
	import EntityProfile from '$lib/components/entity-profile/EntityProfile.svelte';
	import SidebarListItem from '$lib/components/layout/SidebarListItem.svelte';
	import ListOfItems from '$lib/components/lists/ListOfJudges.svelte';

	import {
		allJudgesStore,
		countyNameFilterStore,
		currentListTargetStore,
		currentPageStore,
		judgeNameFilterStore,
		selectedCountyStore,
		selectedEntityStore,
		selectedJudgeStore
	} from '$lib/stores/data';
	import { type Judge, SortOrder, SortTarget } from '$lib/types/frontendTypes';
	import { sortListByTargetGivenRaceAndSeverity } from '$lib/utils/sort';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const clearSelection = () => {

	};

	$: currentPage = $currentPageStore;

	$: if (currentPage === 'judges') {
		currentListTargetStore.set('judges');
	} else if (currentPage === 'counties') {
		currentListTargetStore.set('counties');
	} else {
		currentListTargetStore.set('state');
	}

	$: selectedEntityStore.set($selectedJudgeStore || $selectedCountyStore);

	const selectPage = (page: 'judges' | 'counties' | 'state' | 'contact') => {
		currentPageStore.set(page);
	};

	// const filterJudges = (judges: Judge[], query: string, county: string) => {
	// 	if (!query && !county) return judges;
	// 	return judges.filter(judge =>
	// 		(!query || judge.name.toLowerCase().includes(query.toLowerCase())) &&
	// 		(!county || judge.primaryCounty === county)
	// 	);
	// };
	let judges: Judge[] = [];

	const sortTarget = writable<SortTarget>(SortTarget.totalCases);
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
		resultJudges = sortListByTargetGivenRaceAndSeverity(resultJudges, sortTargetValue, sortOrder) as Judge[];
		return resultJudges;
	};

	$: sortedJudges = sortJudges(
		judges,
		sortTargetValue,
		$sortOrder,
		$selectedCountyStore?.name || ''
	);


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
<style>
    /* Global Styles for Responsive Layout */

    html, body {
        height: 100%; /* Ensure html and body fill the viewport */
        margin: 0; /* Remove default margins */
    }

    .container {
        display: flex;
        flex-direction: column; /* Start with vertical layout */
        /*min-height: 100vh; !* Make container at least the viewport height *!*/

    }

    /* Media Queries for Larger Screens */
    @media (min-width: 768px) {
        .container {
            flex-direction: row; /* Display elements side-by-side */
        }

        .sidebar {
            width: 25%; /* Adjust sidebar width as needed */
        }

        .main-content {
            width: 75%; /* Adjust main content width as needed */
        }
    }
</style>


<!--						<Treemap />-->
<div class="container bg-gradient-to-tr from-blue-900/20 via-zinc-950 from-0% to-zinc-900">
	<div class="sidebar sm:h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
		<div class="flex grow flex-col gap-y-5 py-4 overflow-y-auto text-zinc-300 border-r border-zinc-700/50">
			<div class="flex flex-col mt-4 justify-start">
				<Button class="flex justify-start" on:click={() => clearSelection()}>
					<h1
						class="sm:text-5xl text-8xl tracking-[-.04em] bg-gradient-to-tr from-blue-300 to-blue-300 bg-clip-text font-bold text-transparent">
						LawVision</h1>
				</Button>
			</div>
			<nav class="sm:text-base text-5xl flex flex-1 flex-col ">
				<ul role="list" class="pt-6 flex flex-1 flex-col ">
					<SidebarListItem {selectPage} itemType="judges" />
<!--					<SidebarListItem {selectPage} itemType="state" />-->
				</ul>
			</nav>
		</div>
	</div>

	<div class="main-content h-screen border-r border-zinc-800 overflow-y-scroll">
		<div class=" z-40 flex items-center gap-x-6 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
		</div>
		<ListOfItems />
	</div>

	<main class="">
		<div class="">
			<div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 sm:h-screen">
				{#if $selectedEntityStore}
					<EntityProfile entity={$selectedEntityStore} />
				{/if}
			</div>
		</div>
	</main>
</div>
