<script lang="ts">

	import JudgeInfoHeader from '$lib/components/judge-focus/JudgeInfoHeader.svelte';
	import JudgeStatsGrid from '$lib/components/judge-focus/JudgeStatsGrid.svelte';
	import { allCountiesStore, selectedJudgeStore } from '$lib/stores/data';
	import { type County } from '$lib/types/frontendTypes';

	let county: County | undefined;
	let hoveredStat: string | null = null;

	// Reactive assignments
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: countyName = selectedJudgeInfo?.primaryCounty;
	$: county = $allCountiesStore.find(c => c.name === countyName);

	const handleMouseEnter = (stat: string) => {
		hoveredStat = stat;
	};

	const handleMouseLeave = () => {
		hoveredStat = null;
	};


</script>

<div>
	<JudgeInfoHeader selectedJudgeInfo={selectedJudgeInfo} />
	<JudgeStatsGrid {selectedJudgeInfo} {county} {hoveredStat} {handleMouseEnter} {handleMouseLeave} />
</div>
