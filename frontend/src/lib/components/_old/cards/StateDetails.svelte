<script lang="ts">
	import LawCard from '$lib/components/_old/cards/LawCard.svelte';
	import HoverableItem from '$lib/components/shared/HoverableItem.svelte';
	import Money from '$lib/components/shared/Money.svelte';
	import ScrollableList from '$lib/components/shared/ScrollableList.svelte';

	import StatItem from '$lib/components/shared/StatItem.svelte';
	import {
		countyJudgesStore,
		selectedCountyStore,
		selectedJudgeStore,
		selectedMetricStore,
		stateBailCases,
		stateBailCasesPct
	} from '$lib/stores/data';
	import type { County, Judge } from '$lib/types/frontendTypes';
	import { formatNumber } from '$lib/utils';

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
		<ScrollableList class="stat-wrapper">
			<StatItem>
				<h3 slot="title">Number of cases:</h3>
				<p slot="stat" class="font-bold text-right text-zinc-400 font-mono">
					{formatNumber(stateBailCases.caseCount)}
				</p>
			</StatItem>
			<StatItem onMouseEnter={() => handleMouseEnter('amount')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				<p slot="stat">
					<Money
						value={hoveredStat === 'amount' ? stateBailCases.totalBailSet : stateBailCases.averageBailSet} />
				</p>
			</StatItem>
			<StatItem onMouseEnter={() => handleMouseEnter('remand')} onMouseLeave={handleMouseLeave}
								onClick={()=>selectedMetricStore.set('remand')}>
				<h3
					slot="title">{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}</h3>
				<p slot="stat" class="text-red-600">
					<HoverableItem
						targetBool={hoveredStat === 'remand'}
						valueWhenNotHovered={formatNumber(stateBailCasesPct.remand * 100) + '%'}
						valueWhenHovered={formatNumber(stateBailCases.remand)}
					/>
				</p>
			</StatItem>
			<StatItem onMouseEnter={() => handleMouseEnter('release')} onMouseLeave={handleMouseLeave}
								onClick={()=>selectedMetricStore.set('release')}>
				<h3
					slot="title">{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}</h3>
				<p slot="stat" class="text-green-600">
					<HoverableItem
						targetBool={hoveredStat === 'release'}
						valueWhenNotHovered={formatNumber(stateBailCasesPct.release * 100) + '%'}
						valueWhenHovered={formatNumber(stateBailCases.release)}
					/>
				</p>
			</StatItem>
			<StatItem onMouseEnter={() => handleMouseEnter('bail')} onMouseLeave={handleMouseLeave}
								onClick={()=>selectedMetricStore.set('bail')}>
				<h3
					slot="title">{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}</h3>
				<p slot="stat" class="text-yellow-300">
					<HoverableItem
						targetBool={hoveredStat === 'bail'}
						valueWhenNotHovered={formatNumber(stateBailCasesPct.bailSet * 100) + '%'}
						valueWhenHovered={formatNumber(stateBailCases.bailSet)}
					/>
				</p>
			</StatItem>
			<StatItem onMouseEnter={() => handleMouseEnter('unknown')} onMouseLeave={handleMouseLeave}>
				<h3 slot="title">{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}</h3>
				<p slot="stat" class="text-zinc-600">
					<HoverableItem
						targetBool={hoveredStat === 'unknown'}
						valueWhenNotHovered={formatNumber(stateBailCasesPct.unknown * 100) + '%'}
						valueWhenHovered={formatNumber(stateBailCases.unknown)}
					/>
				</p>
			</StatItem>
		</ScrollableList>
	</div>
</LawCard>
