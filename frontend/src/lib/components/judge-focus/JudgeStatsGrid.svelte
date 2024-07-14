<script lang="ts">
	import type {
		AllCaseResults,
		ArraignmentResultsByRace,
		BailSet,
		ResultsBySeverity,
		SeverityResult
	} from '$lib/types/frontendTypes';
	import JudgeStatItem from './JudgeStatItem.svelte';
	import { formatNumber, sortListByTarget } from '$lib/utils';

	export let hoveredStat: string | null;
	export let handleMouseEnter: (stat: string) => void;
	export let handleMouseLeave: () => void;
	export let label = 'All Charges';
	export let severity: keyof ResultsBySeverity | '' = '';
	export let caseResults: ResultsBySeverity | AllCaseResults | undefined;

	const coerceSeverity = (s: string): keyof ResultsBySeverity | 'total' => {
		if (caseResults && s in caseResults) {
			return s as keyof ResultsBySeverity;
		} else {
			return 'total';
		}
	};

	const getValue = (metric: keyof AllCaseResults['total'], isMoney: boolean, severity: keyof ResultsBySeverity | ''): number => {
		if (severity) {
			const severityResult = caseResults as ResultsBySeverity;
			if (severityResult[severity]) {
				const value = severityResult[severity].total[metric];
				return isMoney ? value as number : (value as BailSet)?.percent || 0;
			}
		} else {
			const allCaseResults = caseResults as AllCaseResults;
			const value = allCaseResults.total[metric];
			return isMoney ? value as number : (value as BailSet)?.percent || 0;
		}
		return 0;
	};

	const getTotalCases = (severity: keyof ResultsBySeverity | ''): number => {
		if (severity) {
			const severityResult = caseResults as ResultsBySeverity;
			if (severityResult[severity]) {
				return severityResult[severity].total.totalCases;
			}
		} else {
			const allCaseResults = caseResults as AllCaseResults;
			return allCaseResults.total.totalCases;
		}
		return 0;
	};

	let raceValues: ArraignmentResultsByRace | undefined;

	const getArraignmentResultsByRace = (severity: keyof ResultsBySeverity | ''): ArraignmentResultsByRace | undefined => {
		if (severity) {
			const severityResult = caseResults as ResultsBySeverity;
			if (severityResult[severity]) {
				return severityResult[severity].byRace;
			}
		} else {
			const allCaseResults = caseResults as AllCaseResults;
			return allCaseResults.byRace;
		}
	};

</script>

<div class="flex flex-col">
	<!-- JudgeStatsGrid -->
	<div class="flex flex-row justify-center">
		<div class="bg-zinc-900">
			<div class="mx-auto max-w-7xl">
				{#if caseResults}
					<div class="grid w-full">
						<div
							class="flex flex-row justify-between mx-2 text-zinc-200 bg-zinc-950/50 rounded-t-3xl text-left px-10 py-2 pt-6 w-full text-2xl mt-6 mb-0.5 tracking-tighter">
							<h3
								class="flex">
								{label}
							</h3>
							<h2 class="flex flex-row justify-between align-text-bottom">
								<span class="totalCases-color font-mono font-bold pr-1">{formatNumber(getTotalCases(severity))}</span>
								<span class="text-base">cases</span>
							</h2>
						</div>
						<div class="grid grid-cols-2 w-full rounded-md gap-x-0.5 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-4">
							<JudgeStatItem
								{severity}
								label="Average Bail Amount"
								metric="averageBailAmount"
								value={getValue('averageBailAmount', true, severity)}
								raceValues={caseResults}
								isMoney={true}
								{hoveredStat}
							/>
							<JudgeStatItem
								{severity}
								label="Bail Set Frequency"
								metric="bailSet"
								value={getValue('bailSet', false, severity)}
								raceValues={caseResults}
								isHoverable={true}
								{hoveredStat}
							/>
							<JudgeStatItem
								{severity}
								label="Remand Frequency"
								metric="remanded"
								value={getValue('remanded', false, severity)}
								raceValues={caseResults}
								isHoverable={true}
								{hoveredStat}
							/>
							<JudgeStatItem
								{severity}
								label="Release Frequency"
								metric="released"
								value={getValue('released', false, severity)}
								raceValues={caseResults}
								isHoverable={true}
								{hoveredStat}
							/>
							<JudgeStatItem
								{severity}
								label="Average Bail Amount"
								metric="totalCases"
								value={getValue('totalCases', false, severity)}
								raceValues={caseResults}
								isMoney={true}
								{hoveredStat}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
