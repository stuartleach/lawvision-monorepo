<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { JudgeProperties } from '$lib/types';
	import { selectedJudgeStore } from '$lib/stores/data';

	let selectedJudgeInfo: JudgeProperties | null;

	$: selectedJudgeInfo = $selectedJudgeStore;


</script>

<div
	class="judge-detail">
	<h2>{selectedJudgeInfo?.judge_name || "The Honorable Judge X"}</h2>
	<div class="w-full h-full flex-col gap-5">
		<ul class="space-y-2">
			<li
				class="judge-stat">
				<div class="left text-left">
					<h3 class="text-lg text-zinc-300 font-bold">Average bail amount:
					</h3>
				</div>
				<div class="right text-right">
					<div class="money flex-row text-right">
						<span class="text-green-600">$</span>
						<span
							class="font-bold text-white font-mono">{selectedJudgeInfo ? formatMoney(selectedJudgeInfo.average_bail_set).split('.')[0] : '0'}</span>&nbsp;<span
						class="super font-mono">.{selectedJudgeInfo ? formatMoney(selectedJudgeInfo.average_bail_set).split('.')[1] : '00'}</span>
					</div>
				</div>
			</li>
			<li
				class="judge-stat">
				<h3 class="text-lg text-zinc-300 font-bold">Number of cases:
				</h3>
				<p
					class="font-bold text-white text-right font-mono">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo.case_count) : '0'}</p>
			</li>
			<li
				class="judge-stat">
				<h3 class="text-lg text-zinc-300 font-bold">Remand frequency: </h3>
				<p
					class="font-bold text-white font-mono text-right">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo.case_count) : '0'}</p>
			</li>
			<li
				class="judge-stat">
				<h3 class="text-lg text-zinc-300 font-bold">ROR frequency: </h3>
				<p
					class="font-bold text-white font-mono text-right">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo.case_count) : '0'}</p>
			</li>
			<li
				class="judge-stat">
				<h3 class="text-lg text-zinc-300 font-bold">Bail set frequency: </h3>
				<p
					class="font-bold text-white font-mono text-right">{selectedJudgeInfo ? formatNumber(selectedJudgeInfo.case_count) : '0'}</p>
			</li>
		</ul>
	</div>
</div>

<style>

</style>
