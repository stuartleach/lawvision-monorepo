<script lang="ts">
	import { getJudgeArraignmentStatistics } from '$lib/api';
	import DownChevron from '$lib/components/assets/DownChevron.svelte';
	import UpChevron from '$lib/components/assets/UpChevron.svelte';
	import JudgeInfo from '$lib/components/judge-focus/JudgeInfo.svelte';
	import JudgeInfoHeader from '$lib/components/judge-focus/JudgeInfoHeader.svelte';
	import JudgeStatsGrid from '$lib/components/judge-focus/JudgeStatsGrid.svelte';
	import { allCountiesStore, selectedJudgeArraignmentStatisticsStore, selectedJudgeStore } from '$lib/stores/data';
	import type { ArraignmentStatisticsModel } from '$lib/types';
	import { type County } from '$lib/types/frontendTypes';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let county: County | undefined;
	let hoveredStat: string | null = null;

	$: selectedJudgeInfo = $selectedJudgeStore;


	onMount(async () => {
			try {
				if (selectedJudgeInfo) {
					await getJudgeArraignmentStatistics({
						fetch: fetch, judgeId: selectedJudgeInfo?.judgeUUID
					});
				}
				console.log('selectedArraignmentStatisticsStore', $selectedJudgeArraignmentStatisticsStore);
			} catch (e) {
				console.error(e);
			}
		}
	);

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

</script>

<div>
	<JudgeInfoHeader {selectedJudgeInfo} />
	<div class="justify-center">
		<JudgeStatsGrid
			{selectedJudgeInfo}
			{hoveredStat}
			{handleMouseEnter}
			{handleMouseLeave}
		/>

		<div class="grid justify-center">
			{#if $expanded}
				<JudgeInfo {selectedJudgeInfo}
									 {hoveredStat}
									 {handleMouseEnter}
									 {handleMouseLeave} />
				<Button class="scale-[300%] p-20" on:click={toggleExpanded}>
					<UpChevron />
				</Button>
			{:else}
				<Button class="bg-red-500" on:click={toggleExpanded}>
					<DownChevron />
				</Button>
			{/if}
		</div>
	</div>
</div>
