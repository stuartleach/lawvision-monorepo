<script lang="ts">
	import { selectedJudgeStore } from '$lib/stores/data';
	import type { Judge } from '$lib/types/frontendTypes';
	import StatCard from './StatCard.svelte';

	let hoveredStat: string | null = null;

	const handleMouseEnter = (stat: string) => {
		hoveredStat = stat;
	};

	const handleMouseLeave = () => {
		hoveredStat = null;
	};

	$: selectedJudgeInfo = $selectedJudgeStore;

</script>

<div class="flex flex-col">
	<div class="flex flex-row justify-center">
		<div class="flex">
			<dl class="flex flex-row w-full">
				<div class="bg-zinc-900">
					<div class="mx-auto max-w-7xl">
						<div class="grid grid-cols-1 gap-2 bg-white/5 sm:grid-cols-3 lg:grid-cols-5">
							<div class="m-2">
								<StatCard
									metric="caseCount"
									title="Total Cases"
									judgeValue={selectedJudgeInfo?.stats?.caseCount}
									countyValue={selectedJudgeInfo?.stats?.pctileCounty?.caseCount}
									stateValue={selectedJudgeInfo?.stats?.pctileState?.caseCount} />
							</div>
							<div class="m-2">
								<StatCard
									metric="averageBailSet"
									title="Average Bail Amount"
									judgeValue={selectedJudgeInfo?.stats?.averageBailSet}
									countyValue={selectedJudgeInfo?.stats?.pctileCounty?.bailAmount}
									stateValue={selectedJudgeInfo?.stats?.pctileState?.bailAmount} />
							</div>
							<div class="m-2">

								<StatCard
									metric="bailSet"
									title={hoveredStat === 'bail' ? 'Bail set total' : 'Bail Set Frequency'}
									judgeValue={selectedJudgeInfo?.stats?.pct?.bailSet}
									countyValue={selectedJudgeInfo?.stats?.pctileCounty?.bailSet}
									stateValue={selectedJudgeInfo?.stats?.pctileState?.bailSet} />

							</div>
							<div class="m-2">
								<StatCard
									metric="remand" title="Remand Frequency"
									judgeValue={selectedJudgeInfo?.stats?.pct?.remand}
									countyValue={selectedJudgeInfo?.stats?.pctileCounty?.remand}
									stateValue={selectedJudgeInfo?.stats?.pctileState?.remand} />
							</div>
							<div class="m-2">
								<StatCard
									metric="release" title="Release Frequency"
									judgeValue={selectedJudgeInfo?.stats?.pct?.release}
									countyValue={selectedJudgeInfo?.stats?.pctileCounty?.release}
									stateValue={selectedJudgeInfo?.stats?.pctileState?.release} />
							</div>

						</div>
					</div>
				</div>
			</dl>
		</div>
	</div>
</div>
