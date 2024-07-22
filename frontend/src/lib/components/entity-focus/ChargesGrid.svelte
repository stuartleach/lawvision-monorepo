<script lang="ts">
	import Money from '$lib/components/shared/Money.svelte';
	import Percent from '$lib/components/shared/Percent.svelte';
	import { graphTargetDataStore, races, severityLabels, severityLevels } from '$lib/stores/data';
	import { type County, type Judge, type SeverityLevel, SortTarget } from '$lib/types/frontendTypes';
	import { formatNumber } from '$lib/utils';
	import { writable } from 'svelte/store';

	export let entity: Judge | County;

	const sortTarget = writable<SortTarget>(SortTarget.caseCount);
	$: sortTargetValue = $sortTarget;

	const selectedSeverity = writable<SeverityLevel | null>(null);

	$: console.log($graphTargetDataStore);
</script>

<!--<div class="mb-8">-->
<!--	<div class="px-4">-->
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
		<thead class="bg-zinc-900 text-sm text-zinc-400 sticky px-5">
		<tr
			class="text-zinc-400 tracking-tight text-base *:w-[18rem] px-5 *:px-10 *:font-semibold first:text-left *:md:table-cell *:cursor-pointer *:py-4">
			<th scope="col" class="text-left">Charge Severity</th>
			<th scope="col" class="text-right">Total Cases</th>
			<th scope="col" class="text-right">Average Bail</th>
			<th scope="col" class="text-right">Bail-Set %</th>
			<th scope="col" class="text-right">Remand %</th>
			<th scope="col" class="text-right">Release %</th>
		</tr>
		</thead>
		<tbody class="bg-zinc-950 text-sm">
		{#each severityLevels.filter(s => entity?.arraignmentResults[s].Any.totalCases > 0) as severity, i}
			<tr
				class:bg-zinc-900={i % 2 === 0 && severity !== 'Any'}
				class="first:font-bold {$selectedSeverity &&
								severity !== $selectedSeverity &&
								'blur-xs opacity-[25%] filter transition-all '} {severity === $selectedSeverity ? 'z-[1000000] ': ''} cursor-pointer text-zinc-300 bg-zinc-950 text-right *:pr-10 *:py-4 first:rounded-t-20 {severity === 'Any' ? 'bg-zinc-900 border-b' : ''}"
				on:click={()=>{$selectedSeverity === severity ? selectedSeverity.set(null) : selectedSeverity.set(severity)}}>
				<td class=" text-left pl-8">{severityLabels[severity]}</td>
				<td
					class="font-mono totalCases-color">{formatNumber(entity.arraignmentResults[severity].Any.totalCases)}</td>
				<td class="font-mono averageBailAmount-color"
						on:click={()=>graphTargetDataStore.set({metric: 'bailSet', severity: severity, race: 'Any', val: 'amount'})}
						class:clicked={ $graphTargetDataStore.metric === 'bailSet' && $graphTargetDataStore.severity === severity && $graphTargetDataStore.race === 'Any' && $graphTargetDataStore.val === 'amount' }>
					<Money value={entity.arraignmentResults[severity].Any.bailSet.amount} />
				</td>
				<td class="font-mono bailSet-color"
						on:click={()=>graphTargetDataStore.set({metric: 'bailSet', severity: severity, race: 'Any', val: 'percent'})}
						class:clicked={ $graphTargetDataStore.metric === 'bailSet' && $graphTargetDataStore.severity === severity && $graphTargetDataStore.race === 'Any' && $graphTargetDataStore.val === 'percent' }>
					<Percent value={entity.arraignmentResults[severity].Any.bailSet.percent} />
				</td>
				<td class="font-mono remanded-color"
						on:click={()=>graphTargetDataStore.set({metric: 'remanded', severity: severity, race: 'Any', val: 'percent'})}
						class:clicked={ $graphTargetDataStore.metric === 'remanded' && $graphTargetDataStore.severity === severity && $graphTargetDataStore.race === 'Any' && $graphTargetDataStore.val === 'percent' }>
					<Percent value={entity.arraignmentResults[severity].Any.remanded.percent} />
				</td>
				<td class="font-mono released-color"
						on:click={()=>graphTargetDataStore.set({metric: 'released', severity: severity, race: 'Any', val: 'percent'})}
						class:clicked={ $graphTargetDataStore.metric === 'released' && $graphTargetDataStore.severity === severity && $graphTargetDataStore.race === 'Any' && $graphTargetDataStore.val === 'percent' }>
					<Percent value={entity.arraignmentResults[severity].Any.released.percent} />
				</td>
			</tr>
			<!--{#if severity === $selectedSeverity}
				<tr class="w-full">
					<td colspan="6" class="w-full">
						<table class="w-full">
							<colgroup>
								<col />
								<col />
								<col class="hidden md:table-cell" />
								<col class="hidden md:table-cell" />
								<col class="hidden md:table-cell" />
								<col class="hidden md:table-cell" />
							</colgroup>
							{#each races.slice(1).filter(r => entity.arraignmentResults?.[severity]?.[r].totalCases > 0) as race, i}
								<tr
									class="text-center px-10 pb-2 grid grid-cols-6 w-full bg-zinc-700 text-zinc-900 tracking-tight first:text-left *:md:table-cell *:cursor-pointer *:pt-4">
									<td class="text-left ">{race}</td>
									<td
										class="font-mono totalCases-color">{formatNumber(entity.arraignmentResults[severity]?.[race].totalCases)}</td>
									<td
										on:click={()=>graphTargetDataStore.set({metric: 'bailSet', severity: severity, race: race, val: 'amount'})}
										class="font-mono averageBailAmount-color { $graphTargetDataStore.metric === 'bailSet' && $graphTargetDataStore.severity === severity && $graphTargetDataStore.race === race && $graphTargetDataStore.val === 'amount' ? 'bg-zinc-500 rounded-2xl text-center align-middle' : '' }">
										<Money value={entity.arraignmentResults[severity][race].bailSet.amount} />
									</td>
									<td
										class="font-mono bailSet-color { $graphTargetDataStore.metric === 'bailSet' && $graphTargetDataStore.severity === severity && $graphTargetDataStore.race === race && $graphTargetDataStore.val === 'percent' ? 'bg-zinc-500 rounded-2xl text-center align-middle' : '' }"
										on:click={()=>graphTargetDataStore.set({metric: 'bailSet', severity: severity, race: race, val: 'percent'})}>
										<Percent value={entity.arraignmentResults[severity][race].bailSet.percent} />
									</td>
									<td
										class="font-mono remanded-color { $graphTargetDataStore.metric === 'remanded' && $graphTargetDataStore.severity === severity && $graphTargetDataStore.race === race && $graphTargetDataStore.val === 'percent' ? 'bg-zinc-500 rounded-2xl text-center align-middle' : '' }"
										on:click={()=>graphTargetDataStore.set({metric: 'remanded', severity: severity, race: race, val: 'percent'})}>
										<Percent value={entity.arraignmentResults[severity][race].remanded.percent} />
									</td>
									<td
										class="font-mono released-color { $graphTargetDataStore.metric === 'released' && $graphTargetDataStore.severity === severity && $graphTargetDataStore.race === race && $graphTargetDataStore.val === 'percent' ? 'bg-zinc-500 rounded-2xl text-center align-middle' : '' }"
										on:click={()=>graphTargetDataStore.set({metric: 'released', severity: severity, race: race, val: 'percent'})}>
										<Percent value={entity.arraignmentResults[severity][race].released.percent} />
									</td>
								</tr>
							{/each}
						</table>
					</td>
				</tr>
			{/if}-->
		{/each}
		</tbody>
	</table>
</div>
<!--	</div>-->
<!--</div>-->
