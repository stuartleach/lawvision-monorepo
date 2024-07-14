<script lang="ts">
	import JudgeStatItem from '$lib/components/judge-focus/JudgeStatItem.svelte';
	import { severityLevels } from '$lib/stores/data';
	import type { Judge, SeverityLevel, ResultsBySeverity } from '$lib/types/frontendTypes';


	export let selectedJudgeInfo: Judge | null;

	export let hoveredStat: string | null;
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;

	let charges: ResultsBySeverity | undefined;

	$: charges = selectedJudgeInfo?.resultsBySeverity;
	$: console.log(charges);

</script>

<div class="flex flex-col">
	<!-- JudgeInfo -->
	<h2 class="text-zinc-50 tracking-tight text-4xl m-8">Breakdown by Charge</h2>
	<div class="flex flex-row justify-center">
		<div class="bg-zinc-900">
			<div class="mx-auto max-w-7xl">
				{#if selectedJudgeInfo}
					{#each severityLevels as severity}
						<div class="grid w-full">
							<h3
								class="mx-2 text-zinc-200 bg-zinc-950/50 rounded-t-3xl text-left pl-10 py-2 pt-6 w-full text-2xl mt-6 mb-0.5 tracking-tighter">{severity}</h3>
							<div
								class="grid grid-cols-2 w-full rounded-none gap-x-0.5 sm:gap-x-0.5 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-4">
								<JudgeStatItem
									label="Average Bail Amount"
									metric="averageBailAmount"
									{severity}
									isMoney={true}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
								<JudgeStatItem
									label="Bail Set Frequency"
									metric="bailSet"
									{severity}
									isHoverable={true}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
								<JudgeStatItem
									label="Remand Frequency"
									metric="remanded"
									{severity}
									isHoverable={true}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
								<JudgeStatItem
									label="Release Frequency"
									metric="released"
									{severity}
									isHoverable={true}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
