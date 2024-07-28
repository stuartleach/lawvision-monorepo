<script lang="ts">
	import { convertSortTargetToMetric, formatNumber } from '$lib/utils/format';
	import {
		allJudgesStore, deviationStore,
		filterRaceStore,
		filterSeverityStore,
		selectedEntityStore,
		sortTargetStore
	} from '$lib/stores/data';
	import { numberOfJudgesInCounty, setStore } from '$lib/utils/misc.js';
	import { type County, type Judge, SortTarget } from '$lib/types/frontendTypes';

	export let targetItems: 'judges' | 'counties';
	export let entity: Judge | County;

	let targetValue: number;

	$: if ($sortTargetStore && $deviationStore) {
		switch ($sortTargetStore) {
			case SortTarget.totalCases:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].totalCases - entity.arraignmentResults[$filterSeverityStore].Any.totalCases;
				break;
			case SortTarget.averageBailAmount:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].bailSet.amount - entity.arraignmentResults[$filterSeverityStore].Any.bailSet.amount;
				break;
			case SortTarget.bailSet:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].bailSet.percent - entity.arraignmentResults[$filterSeverityStore].Any.bailSet.percent;
				break;
			case SortTarget.remanded:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].remanded.percent - entity.arraignmentResults[$filterSeverityStore].Any.remanded.percent;
				break;
			case SortTarget.released:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].released.percent - entity.arraignmentResults[$filterSeverityStore].Any.released.percent;
				break;
			default:
				targetValue = 0;
		}
	}

	$: if ($sortTargetStore && !$deviationStore) {
		switch ($sortTargetStore) {
			case SortTarget.totalCases:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].totalCases;
				break;
			case SortTarget.averageBailAmount:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].bailSet.amount;
				break;
			case SortTarget.bailSet:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].bailSet.percent;
				break;
			case SortTarget.remanded:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].remanded.percent;
				break;
			case SortTarget.released:
				targetValue = entity.arraignmentResults[$filterSeverityStore][$filterRaceStore].released.percent;
				break;
			default:
				targetValue = 0;
		}
	}


</script>
<li class="flex justify-between gap-x-4 py-5 cursor-pointer p-6 hover:bg-zinc-600"
		on:click={()=>setStore(targetItems, entity)}>
	<div class="flex min-w-0 gap-x-4">
		<div class="min-w-0 flex-auto flex-row justify-between">
			<p class="text-sm font-semibold leading-6 text-zinc-400">
							<span
								class="inset-x-0 -top-px bottom-0 text-lg {$selectedEntityStore === entity ? 'text-white' :''}">{entity.name}</span>
			</p>
			{#if targetItems === 'judges'}
				<p class="flex text-xs leading-5 text-gray-500">
					<a href="/"
						 class="relative truncate hover:underline">{entity?.primaryCounty || ""}</a>
				</p>
			{:else}
				<p class=" flex text-xs leading-5 text-gray-500">
					<a class="relative truncate hover:underline">{numberOfJudgesInCounty(entity, $allJudgesStore)} judges</a>
				</p>
			{/if}
		</div>
	</div>
	<div class="flex self-center float-right ">
		<p class="text-zinc-300 text-sm font-mono {convertSortTargetToMetric($sortTargetStore)}-color ">
			{#if $sortTargetStore === SortTarget.averageBailAmount} ${/if} {formatNumber(targetValue)}
			{#if $sortTargetStore !== SortTarget.averageBailAmount && $sortTargetStore !== SortTarget.totalCases} %{/if}
		</p>

		<svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
			<path fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd" />
		</svg>
	</div>
</li>
