<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { County, Judge } from '$lib/types/types';
	import { selectedCountyStore, selectedJudgeStore, selectedMetricStore, countyJudgesStore } from '$lib/stores/data';
	import { stateBailCases, stateBailCasesPct } from '$lib/stores/data';

	import {
		LawCard,
		ScrollableList,
		ClickableListItem,
		Money,
		HoverableItem
	} from '$components';

	let county: County | null = null;
	let selectedJudgeInfo: Judge | null = null;
	let topJudges: Judge[] = [];
	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let hoveredStat: string | null = null;

	// Reactive declarations
	$: metric = $selectedMetricStore;
	$: selectedJudgeInfo = $selectedJudgeStore;
	$: county = $selectedCountyStore;
	$: topJudges = $countyJudgesStore;
	let countyName: string;
	let totalBailAmount: number;
	let numberOfCasesRaw: number;


	$: countyName = county?.name ?? '';
	$: averageBailAmount = county?.stats.averageBailSet ?? 0;
	$: totalBailAmount = county?.stats.totalBailSet ?? 0;
	$: numberOfCasesRaw = county?.stats.caseCount ?? 0;
	$: numberOfCases = formatNumber(county?.stats.caseCount ?? 0);

	function handleMouseEnter(stat: string) {
		hoveredStat = stat;
	}

	function handleMouseLeave() {
		hoveredStat = null;
	}
</script>

<LawCard>
	<h4 slot="super-title">Pretrial Data for</h4>
	<h2 slot="title">New York State</h2>
	<div slot="data">
		<ScrollableList>
			<ClickableListItem>
				<h3 slot="title">Number of cases:</h3>
				<p slot="stat" class="font-bold text-right text-zinc-400 font-mono">
					{formatNumber(stateBailCases.totalCases)}
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('amount')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				<p slot="stat">
					<Money
						value={hoveredStat === 'amount' ? stateBailCases.totalBailSetAmount : stateBailCases.averageBailAmount} />
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('remand')} onMouseLeave={handleMouseLeave}
												 onClick={()=>selectedMetricStore.set('remand')}>
				<h3
					slot="title">{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}</h3>
				<p slot="stat" class="text-red-600">
					<HoverableItem
						targetBool={hoveredStat === 'remand'}
						valueWhenNotHovered={formatNumber(stateBailCasesPct.remandCasesPct * 100) + '%'}
						valueWhenHovered={formatNumber(stateBailCases.remandCases)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('release')} onMouseLeave={handleMouseLeave}
												 onClick={()=>selectedMetricStore.set('release')}>
				<h3
					slot="title">{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}</h3>
				<p slot="stat" class="text-green-600">
					<HoverableItem
						targetBool={hoveredStat === 'release'}
						valueWhenNotHovered={formatNumber(stateBailCasesPct.releasePct * 100) + '%'}
						valueWhenHovered={formatNumber(stateBailCases.releaseCases)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('bail')} onMouseLeave={handleMouseLeave}
												 onClick={()=>selectedMetricStore.set('bail')}>
				<h3
					slot="title">{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}</h3>
				<p slot="stat" class="text-yellow-300">
					<HoverableItem
						targetBool={hoveredStat === 'bail'}
						valueWhenNotHovered={formatNumber(stateBailCasesPct.bailSetCasesPct * 100) + '%'}
						valueWhenHovered={formatNumber(stateBailCases.bailSetCases)}
					/>
				</p>
			</ClickableListItem>
			<ClickableListItem onMouseEnter={() => handleMouseEnter('unknown')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}</h3>
				<p slot="stat" class="text-zinc-600">
					<HoverableItem
						targetBool={hoveredStat === 'unknown'}
						valueWhenNotHovered={formatNumber(stateBailCasesPct.unknownCasesPct * 100) + '%'}
						valueWhenHovered={formatNumber(stateBailCases.unknownCases)}
					/>
				</p>
			</ClickableListItem>
		</ScrollableList>
	</div>
</LawCard>
