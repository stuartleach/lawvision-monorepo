<script lang="ts">
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import { races, selectedJudgeStore, severityLabels, severityLevels } from '$lib/stores/data';
	import { type SeverityLevel, SortTarget } from '$lib/types/frontendTypes';
	import { formatNumber } from '$lib/utils';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	let judge = $selectedJudgeStore;

	const sortTarget = writable<SortTarget>(SortTarget.caseCount);
	let sortTargetValue: SortTarget;
	$: sortTargetValue = $sortTarget;

	// const selectedSeverity = writable<SeverityLevel>('Any');
	const selectedSeverity = writable<SeverityLevel>(null);

	$: {
		console.log($selectedSeverity);
	}
</script>

<div class="mt-2">
	<div class="px-4">
		<div class="mt-6 flex justify-center w-full">
			<table class="w-full bg-white p-20 py-20">
				<colgroup>
					<col />
					<col />
					<col class="hidden md:table-cell" />
					<col class="hidden md:table-cell" />
					<col class="hidden md:table-cell" />
					<col class="hidden md:table-cell" />
				</colgroup>
				<thead class="bg-zinc-900 text-base text-zinc-400 sticky px-5">
				<tr
					class="text-zinc-400 tracking-tight text-xl px-5 *:px-10 *:font-semibold first:text-left *:md:table-cell *:cursor-pointer *:pt-4">
					<th scope="col" class="text-left">Charge Severity</th>
					<th scope="col" class="text-right">Total Cases</th>
					<th scope="col" class="text-right">Average Bail</th>
					<th scope="col" class="text-right">Bail-Set %</th>
					<th scope="col" class="text-right">Remand %</th>
					<th scope="col" class="text-right">Release %</th>
				</tr>
				</thead>
				<tbody class="bg-zinc-950" transition:slide>
				{#each severityLevels.filter(s => judge.arraignmentResults[s].Any.totalCases > 0) as severity, i}
					<tr
						class:bg-zinc-900={i % 2 === 0 && severity !== 'Any'}
						transition:slide
						class="first:font-bold {$selectedSeverity &&
							severity !== $selectedSeverity &&
							'blur-xs opacity-[15%] filter transition-all '} {severity === $selectedSeverity ? 'z-[1000000] ': ''} cursor-pointer text-zinc-300 bg-zinc-950 text-right *:pr-10 *:py-4 first:rounded-t-20 {severity === 'Any' ? 'bg-zinc-900 border-b' : ''}"
						on:click={()=>{$selectedSeverity === severity ? selectedSeverity.set(null) : selectedSeverity.set(severity)}}>
						<td class=" text-left pl-8">{severityLabels[severity]}</td>
						<td
							class="font-mono totalCases-color">{formatNumber(judge.arraignmentResults[severity].Any.totalCases)}</td>
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
					{#if severity === $selectedSeverity}
						<tr class="w-full">
							<td colspan="6" class=" bg-black/50 w-full">
								<table class="w-full">
									<colgroup>
										<col />
										<col />
										<col class="hidden md:table-cell" />
										<col class="hidden md:table-cell" />
										<col class="hidden md:table-cell" />
										<col class="hidden md:table-cell" />
									</colgroup>
									{#each races.slice(1).filter(r => judge.arraignmentResults[severity][r].totalCases > 0) as race, i}
										<tr
											class="px-10 pb-2 w-full text-zinc-300 text-right grid grid-cols-6 w-full bg-zinc-700  =*:py-4 text-zinc-900 tracking-tight   first:text-left *:md:table-cell *:cursor-pointer *:pt-4">
											<td class="text-left ">{race}</td>
											<td
												class="font-mono totalCases-color">{formatNumber(judge.arraignmentResults[severity][race].totalCases)}</td>
											<td class="font-mono averageBailAmount-color">
												<Money value={judge.arraignmentResults[severity][race].bailSet.amount} />
											</td>
											<td class="font-mono bailSet-color">
												<Percent value={judge.arraignmentResults[severity][race].bailSet.percent} />
											</td>
											<td class="font-mono remanded-color">
												<Percent value={judge.arraignmentResults[severity][race].remanded.percent} />
											</td>
											<td class="font-mono released-color">
												<Percent value={judge.arraignmentResults[severity][race].released.percent} />
											</td>
										</tr>
									{/each}
								</table>
							</td>
						</tr>
					{/if}
				{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
