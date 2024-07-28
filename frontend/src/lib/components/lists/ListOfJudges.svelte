<script lang="ts">
	import DropdownSelect from '$lib/components/entity-profile/DropdownSelect.svelte';
	import EntityLi from '$lib/components/entity-profile/EntityLi.svelte';
	import {
		allCountiesStore,
		allJudgesStore,
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
	$: county = $selectedCountyStore;
	$: judge = $selectedJudgeStore;

	const metricOptions = [...Object.values(SortTarget)];

	$: selectedEntityStore.set($selectedJudgeStore || $selectedCountyStore);

	$: targetItems = $currentListTargetStore;
	let items = {
		judges: { name: 'Judges', targets: judges },
		counties: { name: 'Counties', targets: counties }
	};


	$: sortTarget = $sortTargetStore;
	$: selectedMetricStore.set(sortTarget);
	$: sortOrder = $sortOrderStore;

	$: entityList = sortListByTargetGivenRaceAndSeverity(items[targetItems].targets,
		$sortTargetStore, $sortOrderStore, $filterSeverityStore, $filterRaceStore, $deviationStore);


	const handleNextSort = () => {
		if ($sortTargetStore === SortTarget.averageBailAmount) sortTargetStore.set(SortTarget.bailSet);
		else if ($sortTargetStore === SortTarget.bailSet) sortTargetStore.set(SortTarget.remanded);
		else if ($sortTargetStore === SortTarget.remanded) sortTargetStore.set(SortTarget.released);
		else sortTargetStore.set(SortTarget.averageBailAmount);
	};

	const raceOptions = ['Any', 'Black', 'White', 'Asian/Pacific Islander', 'American Indian/Alaskan Native', 'Other', 'Unknown'];

	const nextRace = () => {
		if ($filterRaceStore === 'Any') filterRaceStore.set('Black');
		else if ($filterRaceStore === 'Black') filterRaceStore.set('White');
		else if ($filterRaceStore === 'White') filterRaceStore.set('Asian/Pacific Islander');
		else if ($filterRaceStore === 'Asian/Pacific Islander') filterRaceStore.set('American Indian/Alaskan Native');
		else if ($filterRaceStore === 'American Indian/Alaskan Native') filterRaceStore.set('Other');
		else if ($filterRaceStore === 'Other') filterRaceStore.set('Unknown');
		else filterRaceStore.set('Any');
	};

	const nextDeviation = () => {
		deviationStore.set(!$deviationStore);
	};

	const nextSeverity = () => {
		if ($filterSeverityStore === 'Any') filterSeverityStore.set('AF');
		else if ($filterSeverityStore === 'AF') filterSeverityStore.set('BF');
		else if ($filterSeverityStore === 'BF') filterSeverityStore.set('CF');
		else if ($filterSeverityStore === 'CF') filterSeverityStore.set('DF');
		else if ($filterSeverityStore === 'DF') filterSeverityStore.set('EF');
		else if ($filterSeverityStore === 'EF') filterSeverityStore.set('AM');
		else if ($filterSeverityStore === 'AM') filterSeverityStore.set('BM');
		else if ($filterSeverityStore === 'BM') filterSeverityStore.set('I');
		else if ($filterSeverityStore === 'I') filterSeverityStore.set('UM');
		else if ($filterSeverityStore === 'UM') filterSeverityStore.set('V');
		else filterSeverityStore.set('Any');
	};

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
					<button on:click={handleNextSort}>
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
			<div class="filters flex flex-row gap-x-4 *:w-48">
				<DropdownSelect label="County" options={['All', ...counties]} type="county" />
				<DropdownSelect label="Severity" options={severityOptions} type="severity" />
				<DropdownSelect label="Race" options={raceOptions} type="race" />
				<DropdownSelect label="Direction" options={['asc', 'desc']} type="direction" />
			</div>
		</div>


	</section>

	<ul role="list" class=" divide-y divide-zinc-800/30">
		{#each entityList as entity}
			<EntityLi {entity} {targetItems} />
		{/each}
	</ul>
</div>
