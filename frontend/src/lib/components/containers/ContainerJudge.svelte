<script lang="ts">

	import JudgeInfoHeader from '$lib/components/new/JudgeInfoHeader.svelte';
	import JudgeStatsGrid from '$lib/components/new/JudgeStatsGrid.svelte';
	import { allCountiesStore, selectedJudgeStore } from '$lib/stores/data';
	import { type County, type Judge } from '$lib/types/frontendTypes';

	let selectedJudgeInfo: Judge | null = null;
	let countyName: string | undefined;
	let county: County | undefined;
	let hoveredStat: string | null = null;
	let judgeId: string = '';

	// Reactive assignments
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: judgeId = selectedJudgeInfo?.judgeUUID ?? '';
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
