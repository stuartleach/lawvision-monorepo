<script lang="ts">
	import type { Judge } from '$lib/types';
	import JudgeStatItem from './JudgeStatItem.svelte';

	export let selectedJudgeInfo: Judge | null;
	export let hoveredStat: string | null;
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;
</script>

<div class="flex flex-col">
	<div class="flex flex-row justify-center">
		<div class="bg-zinc-900">
			<div class="mx-auto max-w-7xl">
				{#if selectedJudgeInfo}
					<div class="grid w-full"><h3
						class="mx-2 text-zinc-200 bg-zinc-950/50 rounded-t-3xl text-left pl-10 py-2 pt-6 w-full text-2xl mt-6 mb-0.5 tracking-tighter">
						Pretrial Statistics</h3>
						<div class="grid grid-cols-2 w-full rounded-md gap-x-0.5 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-4">
							<JudgeStatItem
								label="Average Bail Amount"
								metric="averageBail"
								value={selectedJudgeInfo.allCaseResults.total.averageBailAmount || 0}
								isMoney={true}
								{hoveredStat}
								{handleMouseEnter}
								{handleMouseLeave}
							/>
							<JudgeStatItem
								label="Bail Set Frequency"
								metric="bailSet"
								value={selectedJudgeInfo.allCaseResults.total.bailSet.percent || 0}
								isHoverable={true}
								{hoveredStat}
								{handleMouseEnter}
								{handleMouseLeave}
							/>
							<JudgeStatItem
								label="Remand Frequency"
								metric="remand"
								value={selectedJudgeInfo.allCaseResults.total.remanded.percent || 0}
								isHoverable={true}
								{hoveredStat}
								{handleMouseEnter}
								{handleMouseLeave}
							/>

							<JudgeStatItem
								label="Release Frequency"
								metric="release"
								value={selectedJudgeInfo.allCaseResults.total.released.percent || 0}
								isHoverable={true}
								{hoveredStat}
								{handleMouseEnter}
								{handleMouseLeave}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
