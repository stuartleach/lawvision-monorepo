<script lang="ts">
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import { selectedJudgeStore, severityLabels, severityLevels } from '$lib/stores/data';
	import { type SeverityLevel, SortTarget } from '$lib/types/frontendTypes';
	import { formatNumber } from '$lib/utils';
	import { writable } from 'svelte/store';

	let judge = $selectedJudgeStore;

	const sortTarget = writable<SortTarget>(SortTarget.caseCount);
	let sortTargetValue: SortTarget;
	$: sortTargetValue = $sortTarget;

	const selectedSeverity = writable<SeverityLevel>('Any');

	$: {
		console.log($selectedSeverity);
	}

</script>


<div class="mt-2">
	<div class="px-4">
		<div class="mt-6 flex justify-center w-full">
			<table class="w-full bg-white border border-zinc-700 p-20 py-20">
				<colgroup>
					<col />
					<col />
					<col class="hidden md:table-cell" />
					<col class="hidden md:table-cell" />
					<col class="hidden md:table-cell" />
					<col class="hidden md:table-cell" />
				</colgroup>
				<thead class=" bg-zinc-900 text-base text-zinc-400 sticky px-5 ">
				<tr class=" text-zinc-400 tracking-tight text-xl px-5 *:px-10 *:font-semibold *:text-right *:md:table-cell *:cursor-pointer *:py-2">
					<th class=" " scope="col">Charge Severity</th>
					<th scope="col">Total Cases</th>
					<th scope="col">Average Bail Amount</th>
					<th scope="col">Bail-Set %</th>
					<th scope="col">Remand %</th>
					<th scope="col">Release %</th>
				</tr>
				</thead>
				<tbody class=" ">
				{#each severityLevels as severity, i}
					<tr class:bg-zinc-950={i % 2 === 0}
							class:bg-zinc-800={judge === $selectedJudgeStore} class="text-zinc-300 text-right *:pr-10 *:py-4 first:rounded-t-20 "
							on:click={()=>selectedSeverity.set(severity)}>
						<td class="text-right font-bold">{severityLabels[severity]}</td>
						<td class="font-mono totalCases-color">{formatNumber(judge.arraignmentResults[severity].Any.totalCases)}</td>
						<td class="font-mono averageBailAmount-color">
							<Money value={judge.arraignmentResults[severity].Any.bailSet.amount} />
						</td>
						<td class="font-mono bailSet-color">
							<Percent value={judge.arraignmentResults[severity].Any.bailSet.percent} />
						</td>
						<td class="font-mono remanded-color">
							<Percent value={judge.arraignmentResults[severity].Any.remanded.percent} />
						</td>
						<td class="font-mono released-color">
							<Percent value={judge.arraignmentResults[severity].Any.released.percent} />
						</td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
