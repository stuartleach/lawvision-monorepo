<script lang="ts">
	import '../app.css';
	import EntityProfile from '$lib/components/entity-profile/EntityProfile.svelte';
	import SidebarListItem from '$lib/components/layout/SidebarListItem.svelte';
	import ListOfItems from '$lib/components/lists/ListOfJudges.svelte';

	import {
		currentListTargetStore,
		currentPageStore,
		selectedCountyStore,
		selectedEntityStore,
		selectedJudgeStore
	} from '$lib/stores/data';
	import { Button } from 'flowbite-svelte';

	const clearSelection = () => {

	};

	$: currentPage = $currentPageStore;
	$: currentListTarget = $currentListTargetStore;

	$: if (currentPage === 'judges') {
		currentListTargetStore.set('judges');
	} else if (currentPage === 'counties') {
		currentListTargetStore.set('counties');
	} else {
		currentListTargetStore.set('judges');
	}

	$: selectedEntityStore.set($selectedJudgeStore || $selectedCountyStore);

	const selectPage = (page: 'judges' | 'counties' | 'state' | 'contact') => {
		currentPageStore.set(page);
		console.log('>> PAGE SELECTED >>', page);
	};

</script>
<div class="flex flex-row justify-start bg-gradient-to-tr from-blue-900/20 via-zinc-950 from-0% to-zinc-900">
	<div class="h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
		<!-- Sidebar component, swap this element with another sidebar if you like -->
		<div
			class="flex grow flex-col gap-y-5 py-4 overflow-y-auto text-zinc-300 border-r border-zinc-700/50">
			<div class="flex flex-col justify-start">
				<Button class="flex justify-start" on:click={()=>clearSelection()}>
					<h1
						class="text-5xl  tracking-[-.04em] bg-gradient-to-tr from-blue-300 to-blue-300 bg-clip-text font-bold text-transparent">
						LawVision
					</h1>
				</Button>
			</div>
			<nav class="flex flex-1 flex-col ">
				<ul role="list" class="pt-6 flex flex-1 flex-col ">
					<SidebarListItem {selectPage} itemType="judges" />
					<SidebarListItem {selectPage} itemType="counties" />
					<SidebarListItem {selectPage} itemType="state" />
					<!--<SidebarListItem {selectPage} itemType="contact" />-->
				</ul>
			</nav>
		</div>
	</div>
	<div class=" z-40 flex items-center gap-x-6 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
		<button type="button" class="-m-2.5 p-2.5 text-gray-300 lg:hidden">
			<span class="sr-only">Open sidebar</span>
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		</button>
		<div class="flex-1 text-sm font-semibold leading-6 text-gray-300">Dashboard</div>
		<a href="#">
			<h1
				class="text-left text-4xl tracking-[-.04em] bg-gradient-to-tr from-blue-500 to-blue-300 bg-clip-text font-bold text-transparent">
				LawVision
			</h1>
		</a>
	</div>
	<div
		class="overflow-y-scroll h-screen border-r border-zinc-800">
		<ListOfItems />
	</div>
	<main class="">
		<div class="">
			<div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 h-screen">
				{#if $selectedEntityStore}
					<EntityProfile entity={$selectedEntityStore} />
				{:else}
					<br />
				{/if}
			</div>
		</div>
	</main>


</div>
