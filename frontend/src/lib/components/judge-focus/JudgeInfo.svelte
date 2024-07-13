<script lang="ts">
	import JudgeGridItem from '$lib/components/judge-focus/JudgeGridItem.svelte';
	import JudgeStatItem from '$lib/components/judge-focus/JudgeStatItem.svelte';

	// import { type Judge, severityLevels } from '$lib/types';
	import { type Judge, severityLevels } from '$lib/types/frontendTypes';
	export let selectedJudgeInfo: Judge | null;



	export let hoveredStat: string | null;
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;

	$: charges = selectedJudgeInfo?.resultsBySeverity;
	$: console.log(charges);

</script>

<div class="flex flex-col">
	<h2 class="text-zinc-50 tracking-tight text-4xl m-8">Breakdown by Charge</h2>
	<div class="flex flex-row justify-center">
		<div class="bg-zinc-900">
			<div class="mx-auto max-w-7xl">
				{#if selectedJudgeInfo}
					{#each severityLevels as severity}
						<div class="grid w-full"><h3
							class="mx-2 text-zinc-200 bg-zinc-950/50 rounded-t-3xl text-left pl-10 py-2 pt-6 w-full text-2xl mt-6 mb-0.5 tracking-tighter">{severity}
						</h3>
							<div
								class="grid grid-cols-2 w-full rounded-none gap-x-0.5 sm:gap-x-0.5 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-4">
								<JudgeGridItem
									label="Average Bail Amount"
									metric="averageBail"
									value={charges?.[severity].total.averageBailAmount || 0}
									isMoney={true}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
								<JudgeGridItem
									label="Bail Set Frequency"
									metric="bailSet"
									value={ charges?.[severity].total.bailSet.percent || 0}
									isHoverable={true}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>
								<JudgeGridItem
									label="Remand Frequency"
									metric="remand"
									value={charges?.[severity].total.remanded.percent || 0}
									isHoverable={true}
									{hoveredStat}
									{handleMouseEnter}
									{handleMouseLeave}
								/>

								<JudgeGridItem
									label="Release Frequency"
									metric="release"
									value={charges?.[severity].total.released.percent || 0}
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

<!--</div>-->
