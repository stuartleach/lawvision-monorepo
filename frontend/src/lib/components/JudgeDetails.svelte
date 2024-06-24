<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { JudgeExpandedProperties, JudgeProperties } from '$lib/types';
	import { selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';

	let selectedJudgeInfo: JudgeExpandedProperties | null;

	$: selectedJudgeInfo = $selectedJudgeStore;

	let hoveredStat: string | null = null;

	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}

</script>

<div class="judge-detail">
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => selectedJudgeStore.set(null)}>
			<Close />
		</button>
	</div>
	<h4>{selectedJudgeInfo?.judge_name ? "The Honorable Judge" : ""}</h4>
	<h2>{selectedJudgeInfo?.judge_name || "The Honorable Judge X"}</h2>
	<div>
		<ul class="space-y-2">
			<li class="judge-stat">
				<h3 class="text-lg text-zinc-300 font-bold">Total cases:</h3>
				<p
					class="font-bold text-right text-zinc-400 font-mono">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo.case_count) : '0'}</p>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('amount')} on:mouseleave={handleMouseLeave}>
				<div class="left text-left">
					<h3>{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				</div>
				<div class="right text-right">
					<div class="money flex-row text-right">
						<span class="text-green-600">$</span>
						<span
							class="font-bold text-white font-mono">{selectedJudgeInfo ? formatMoney(hoveredStat === 'amount' ? selectedJudgeInfo.cases_bail_set * selectedJudgeInfo.average_bail_set : selectedJudgeInfo.average_bail_set).split('.')[0] : '0'}</span>&nbsp;<span
						class="super font-mono">.{selectedJudgeInfo ? formatMoney(selectedJudgeInfo.average_bail_set).split('.')[1] : '00'}</span>
					</div>
				</div>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('remand')} on:mouseleave={handleMouseLeave}>
				<h3
					class="text-lg text-zinc-300 font-bold">{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}</h3>
				<p class="font-bold font-mono text-right text-red-600">
					{hoveredStat === 'remand' ? formatNumber(selectedJudgeInfo?.cases_remand) : (selectedJudgeInfo ? formatNumber((selectedJudgeInfo.cases_remand / selectedJudgeInfo?.case_count) * 100) + '%' : '0%')}
				</p>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('release')} on:mouseleave={handleMouseLeave}>
				<h3
					class="text-lg text-zinc-300 font-bold">{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}</h3>
				<p class="font-bold font-mono text-right text-green-600">
					{hoveredStat === 'release' ? formatNumber(Number(selectedJudgeInfo?.cases_nmr) + Number(selectedJudgeInfo?.cases_ror)) : (selectedJudgeInfo ? formatNumber(((selectedJudgeInfo.cases_nmr + selectedJudgeInfo.cases_ror) / selectedJudgeInfo?.case_count) * 100) + '%' : '0%')}
				</p>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('bail')} on:mouseleave={handleMouseLeave}>
				<h3
					class="text-lg text-zinc-300 font-bold">{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}</h3>
				<p class="font-bold font-mono text-right text-yellow-300">
					{hoveredStat === 'bail' ? formatNumber(selectedJudgeInfo?.cases_bail_set) : (selectedJudgeInfo ? formatNumber((selectedJudgeInfo?.cases_bail_set / selectedJudgeInfo?.case_count) * 100) + '%' : '0%')}
				</p>
			</li>
			<li class="judge-stat" on:mouseenter={() => handleMouseEnter('unknown')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}</h3>
				<p class="font-bold font-mono text-right text-zinc-600">
					{hoveredStat === 'unknown' ? formatNumber(selectedJudgeInfo?.cases_unknown) : (selectedJudgeInfo ? formatNumber((selectedJudgeInfo?.cases_unknown / selectedJudgeInfo?.case_count) * 100) + '%' : '0%')}
				</p>
			</li>
		</ul>
	</div>
</div>

<style>
    /* Add any custom styles here */
</style>
