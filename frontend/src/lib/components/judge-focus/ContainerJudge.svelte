<script lang="ts">
	import JudgeInfoHeader from '$lib/components/judge-focus/JudgeInfoHeader.svelte';
	import JudgeStatsGrid from '$lib/components/judge-focus/JudgeStatsGrid.svelte';
	import {
		allCountiesStore,
		selectedJudgeStore, severityLevels
	} from '$lib/stores/data';

	import { type County } from '$lib/types/frontendTypes';
	import { writable } from 'svelte/store';

	let county: County | undefined;
	let hoveredStat: string | null = null;

	$: selectedJudgeInfo = $selectedJudgeStore;

	$: countyName = selectedJudgeInfo?.primaryCounty;
	$: county = $allCountiesStore.find((c) => c.name === countyName);

	const handleMouseEnter = (stat: string) => {
		hoveredStat = stat;
	};

	const handleMouseLeave = () => {
		hoveredStat = null;
	};


	const expanded = writable<boolean>(true);

	function toggleExpanded() {
		expanded.set(!$expanded);
	}

	const severityLabels = {
		'AF': 'A Felony',
		'BF': 'B Felony',
		'CF': 'C Felony',
		'DF': 'D Felony',
		'EF': 'E Felony',
		'AM': 'A Misdemeanor',
		'BM': 'B Misdemeanor'
	}

</script>

<div>
	<JudgeInfoHeader {selectedJudgeInfo} />
	<div class="justify-center">
		<JudgeStatsGrid
			caseResults={selectedJudgeInfo?.allCaseResults}
			{hoveredStat}
			{handleMouseEnter}
			{handleMouseLeave}
			severity=""
		/>

		{#each severityLevels as severity}
			<JudgeStatsGrid
				label={severityLabels[severity]}
				caseResults={selectedJudgeInfo?.resultsBySeverity}
				{hoveredStat}
				{handleMouseEnter}
				{handleMouseLeave}
				severity={severity}
			/>
		{/each}
	</div>
</div>
