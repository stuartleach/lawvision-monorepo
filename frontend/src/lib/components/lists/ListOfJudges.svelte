<script lang="ts">
	import DropdownSelect from '$lib/components/entity-profile/DropdownSelect.svelte';
	import EntityLi from '$lib/components/entity-profile/EntityLi.svelte';
	import {
		allCountiesStore,
		allJudgesStore,
		countyNameFilterStore,
		currentListTargetStore,
		deviationStore,
		filterRaceStore,
		filterSeverityStore,
		selectedCountyStore,
		selectedEntityStore,
		selectedJudgeStore,
		selectedMetricStore,
		sortOrderStore,
		sortTargetStore
	} from '$lib/stores/data';
	import { SortOrder, SortTarget } from '$lib/types/frontendTypes';
	import { sortListByTargetGivenRaceAndSeverity } from '$lib/utils/sort';

	let judges = $allJudgesStore;
	let counties = $allCountiesStore.sort((a, b) => a.name.localeCompare(b.name));
	let severityOptions = ['Any', 'AF', 'BF', 'CF', 'DF', 'EF', 'AM', 'BM', 'I', 'V'];

	$: selectedEntityStore.set($selectedJudgeStore || $selectedCountyStore);

	$: targetItems = $currentListTargetStore;
	$: items = {
		judges: {
			name: 'Judges',
			targets: $countyNameFilterStore ? judges.filter(c => c.primaryCounty === $countyNameFilterStore) : judges
		},
		counties: { name: 'Counties', targets: counties }
	};


	$: sortTarget = $sortTargetStore;
	$: selectedMetricStore.set(sortTarget);

	$: entityList = sortListByTargetGivenRaceAndSeverity(items[targetItems].targets,
		$sortTargetStore, $sortOrderStore, $filterSeverityStore, $filterRaceStore, $deviationStore);

	const handleNextSort = () => {
		if ($sortTargetStore === SortTarget.averageBailAmount) sortTargetStore.set(SortTarget.bailSet);
		else if ($sortTargetStore === SortTarget.bailSet) sortTargetStore.set(SortTarget.remanded);
		else if ($sortTargetStore === SortTarget.remanded) sortTargetStore.set(SortTarget.released);
		else sortTargetStore.set(SortTarget.averageBailAmount);
	};

	const handleNextSortDirection = () => {
		if ($sortOrderStore === SortOrder.desc) sortOrderStore.set(SortOrder.asc);
		else sortOrderStore.set(SortOrder.desc);
	};

	const raceOptions = ['Any', 'Black', 'White', 'Asian/Pacific Islander', 'American Indian/Alaskan Native', 'Other', 'Unknown'];

	const nextDeviation = () => {
		deviationStore.set(!$deviationStore);
	};

	const clearAllFilters = () => {
		countyNameFilterStore.set('')
		filterSeverityStore.set('Any')
		filterRaceStore.set('Any')
	}

	const sortTargetColor = (target: SortTarget) => {
		switch (target) {
			case SortTarget.bailSet:
				return 'bailSet';
			case SortTarget.remanded:
				return 'remanded';
			case SortTarget.released:
				return 'released';
			case SortTarget.averageBailAmount:
				return 'averageBailAmount';
			default:
				return '';
		}
	};


</script>

<div>
	<section class="sticky top-0 z-[1000000]">
		<div
			class=" top-0 z-[1000] bg-zinc-950 px-4 py-4 sm:px-6 lg:px-8 flex justify-between align-bottom w-full">
			<div>
				<h1
					class="text-2xl text-left tracking-[-.04em] bg-gradient-to-tr from-blue-500 to-blue-200 bg-clip-text font-bold text-transparent">
					Judges</h1>


				<section class="flex flex-col  gap-1 text-right">
					<button on:click={handleNextSort}>
						<p class="text-zinc-500 text-sm">sorted by
							<span
								class="text-left text-sm tracking-[-.04em] bg-gradient-to-tr from-blue-500 to-blue-300
							bg-clip-text font-bold text-transparent
							{sortTargetColor(sortTarget)}-color">{sortTarget ? sortTarget + ' ' : ''}
						</span>
						</p>
					</button>
					<button on:click={handleNextSortDirection}>
						<p class="text-zinc-500 text-sm">direction
							<span
								class="text-left text-sm tracking-[-.04em] bg-gradient-to-tr from-blue-500 to-blue-300
							bg-clip-text font-bold text-transparent
							{sortTargetColor(sortTarget)}-color">{$sortOrderStore === SortOrder.asc ? 'Lowest to highest' : 'Highest to lowest'}
						</span>
						</p>
					</button>


				</section>

			</div>
			<button on:click={()=>deviationStore.set(!$deviationStore)} class="text-white">
				{$deviationStore ? 'raw value' : 'deviation from mean'}
			</button>
			<div class="filters flex flex-row gap-x-4 *:w-48">
				<DropdownSelect label="County" options={counties.map(c=>c.name)} type="county" />
				<DropdownSelect label="Severity" options={severityOptions} type="severity" />
				<DropdownSelect label="Race" options={raceOptions} type="race" />
			</div>
		</div>


	</section>

	<ul role="list" class=" divide-y divide-zinc-800/30">
		{#if (entityList.length > 0)}
			{#each entityList as entity}
				<EntityLi {entity} {targetItems} />
			{/each}
		{:else}
			<li class="gap-x-4 py-5 cursor-pointer p-6  flex flex-row justify-start">
				<p class="flex text-zinc-500 font-light tracking-tight">No judges found matching selected criteria.</p>
				<button class="flex text-zinc-300 hover:text-zinc-100 transition" on:click={clearAllFilters}>Clear Filters</button>
			</li>

		{/if}
	</ul>
</div>
