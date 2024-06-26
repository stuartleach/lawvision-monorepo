<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/utils';
	import type { County, Judge } from '$lib/types/types';
	import { selectedCountyStore, selectedJudgeStore, selectedMetricStore, countyJudgesStore } from '$lib/stores/data';
	import Close from '$lib/assets/Close.svelte';
	import { LawCard } from '$lib/components/index';

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

	$: casesBailSet = county?.stats.raw.bailSet ?? 0;
	$: casesRelease = county?.stats.raw.release ?? 0;
	$: casesRemand = county?.stats.raw.remand ?? 0;
	$: casesUnknown = county?.stats.raw.unknown ?? 0;

	$: casesBailSetPct = county?.stats.pct.bailSet ?? 0;
	$: casesReleasePct = county?.stats.pct.release ?? 0;
	$: casesRemandPct = county?.stats.pct.remand ?? 0;
	$: casesUnknownPct = county?.stats.pct.unknown ?? 0;


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
	<div class="flex justify-end">
		<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => selectedCountyStore.set(null)}>
			<Close />
		</button>
	</div>
	<h2>{countyName} County</h2>
	<div>
		<ul class="space-y-2">
			<li class="stat">
				<h3 class="text-lg text-zinc-300 font-bold">Number of cases:</h3>
				<p class="font-bold text-right text-zinc-400 font-mono">
					{formatNumber(numberOfCasesRaw)}
				</p>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('amount')} on:mouseleave={handleMouseLeave}>
				<div class="left text-left">
					<h3>{hoveredStat === 'amount' ? 'Total bail set:' : 'Average bail amount:'}</h3>
				</div>
				<div class="right text-right">
					<div class="money flex-row text-right">
						<span class="text-green-600">$</span>
						<span class="font-bold text-white font-mono">
							{county ? formatMoney(hoveredStat === 'amount' ? totalBailAmount : averageBailAmount).split('.')[0] : '0'}
						</span>&nbsp;<span class="super font-mono">
							.{county ? formatMoney(averageBailAmount).split('.')[1] : '00'}
						</span>
					</div>
				</div>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('remand')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'remand' ? 'Remand total:' : 'Remand frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-red-600">
					{hoveredStat === 'remand' ? formatNumber(casesRemand) : (county ? formatNumber(casesRemandPct * 100) + '%' : '0%')}
				</p>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('release')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'release' ? 'Release total:' : 'Release frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-green-600">
					{hoveredStat === 'release' ? formatNumber(casesRelease)
						: (county ? formatNumber(casesReleasePct * 100) + '%' : '0%')}
				</p>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('bail')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'bail' ? 'Bail set total:' : 'Bail set frequency:'}
				</h3>
				<p class="font-bold font-mono text-right text-yellow-300">
					{hoveredStat === 'bail' ? formatNumber(casesBailSet)
						: (county ? formatNumber(casesBailSetPct * 100) + '%'
							: '0%')}
				</p>
			</li>
			<li class="stat" on:mouseenter={() => handleMouseEnter('unknown')} on:mouseleave={handleMouseLeave}>
				<h3 class="text-lg text-zinc-300 font-bold">
					{hoveredStat === 'unknown' ? 'Unknown total:' : 'Unknown:'}
				</h3>
				<p class="font-bold font-mono text-right text-zinc-600">
					{hoveredStat === 'unknown' ? formatNumber(casesUnknown)
						: (county ? formatNumber(casesUnknownPct * 100) + '%'
							: '0%')}
				</p>
			</li>
		</ul>
	</div>
</LawCard>
