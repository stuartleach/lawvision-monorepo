<script lang="ts">
	import { Chart } from 'flowbite-svelte';
	import { allCountiesStore, selectedCountyStore, selectedJudgeStore, selectedStatsStore } from '$lib/stores/data.js';
	import type { CountyFeature, CountyProperties, JudgeProperties } from '$lib/types';
	import { quantize, interpolatePlasma, pie, arc } from 'd3';

	/*
	* Compare to state
	* Compare to county
	* Compare to judge?
	* */


	const stateBailCases = {
		bailSetCases: 124914,
		remandCases: 31023,
		rorCases: 522768,
		nmrCases: 102121,
		unknownCases: 110516
	};

	let selectedStats: string = 'state';
	let countySelectedInfo: CountyProperties | null = null;
	let judgeSelectedInfo: JudgeProperties | null = null;

	const stats = {
		bailSetCases: 0,
		remandCases: 0,
		rorCases: 0,
		nmrCases: 0,
		unknownCases: 0
	};

	$: selectedStats = $selectedStatsStore;
	$: countySelectedInfo = $selectedCountyStore;
	$: judgeSelectedInfo = $selectedJudgeStore;

	$: {
		if (selectedStats === 'state') {
			stats.bailSetCases = stateBailCases.bailSetCases;
			stats.remandCases = stateBailCases.remandCases;
			stats.rorCases = stateBailCases.rorCases;
			stats.nmrCases = stateBailCases.nmrCases;
			stats.unknownCases = stateBailCases.unknownCases;
		} else if (selectedStats === 'county' && countySelectedInfo) {
			stats.bailSetCases = countySelectedInfo.cases_bail_set ?? 0;
			stats.remandCases = countySelectedInfo.cases_remand ?? 0;
			stats.rorCases = countySelectedInfo.cases_ror ?? 0;
			stats.nmrCases = countySelectedInfo.cases_unknown ?? 0;
			stats.unknownCases = countySelectedInfo.cases_unknown ?? 0;
		} else if (selectedStats === 'judge' && judgeSelectedInfo) {
			stats.bailSetCases = judgeSelectedInfo.cases_bail_set ?? 0;
			stats.remandCases = judgeSelectedInfo.cases_remand ?? 0;
			stats.rorCases = judgeSelectedInfo.cases_ror ?? 0;
			stats.nmrCases = judgeSelectedInfo.cases_nmr ?? 0;
			stats.unknownCases = judgeSelectedInfo.cases_unknown ?? 0;
		}

		updateChartData();
	}

	let allCounties: CountyFeature[] = [];
	$: allCounties = $allCountiesStore;

	let target: 'state' | 'county' | 'judge' = 'state';

	let data = [];

	function updateChartData() {
		data = [
			{ type: 'Bail Set', value: stats.bailSetCases },
			{ type: 'Remand', value: stats.remandCases },
			{ type: 'ROR', value: stats.rorCases },
			{ type: 'NMR', value: stats.nmrCases },
			{ type: 'Unknown', value: stats.unknownCases }
		];
	}

	const width = 400; // outer width of the chart, in pixels
	const height = width; // outer height of the chart, in pixels
	const percent = false; // format values as percentages (true/false)
	const fontSize = 16; // font size of the x and y values
	const strokeWidth = 1; // width of stroke separating wedges
	const strokeLinejoin = 'round'; // line join style of stroke separating wedges
	const outerRadius = Math.min(width, height) * 0.5 - 60; // outer radius of the circle, in pixels
	const innerRadius = 0; // inner radius of the chart, in pixels
	const labelRadius = (innerRadius * 0.2 + outerRadius * 0.8); // center radius of labels
	const strokeColorWOR = 'rgba(23,23,18,0.76)'; // stroke color when inner radius is greater than 0
	const strokeColorWIR = 'none'; // stroke color when inner radius is 0
	const stroke = innerRadius > 0 ? strokeColorWIR : strokeColorWOR; // stroke separating widths
	const padAngle = stroke === 'none' ? 1 / outerRadius : 0; // angular separation between wedges

	let colors = ['#ffaf00', '#ff0e0e', '#2ca02c', '#0510ff', 'rgb(128, 128, 128)'];

	let wedges = [];
	let xVals = [];
	let yVals = [];
	let iVals = [];

	$: {
		xVals = data.map(d => d.type);
		yVals = data.map(d => d.value);
		if (percent) {
			const total = yVals.reduce((a, b) => a + b, 0);
			yVals = yVals.map(val => val / total);
		}
		iVals = data.map((_, i) => i);

		wedges = pie().padAngle(padAngle).sort(null).value(i => yVals[i])(iVals);
	}

	const arcPath = arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);

	const arcLabel = arc()
		.innerRadius(labelRadius)
		.outerRadius(labelRadius);
</script>

<svg {width} {height} viewBox="{-width / 2} {-height / 2} {width} {height}">
	{#each wedges as wedge, i}
		<path fill={colors[i]} d={arcPath(wedge)} stroke={stroke} stroke-width={strokeWidth}
					stroke-linejoin={strokeLinejoin} />
		<g text-anchor='middle' transform='translate({arcLabel.centroid(wedge)})'>
			<text font-size={fontSize}>
				<tspan font-weight='bold'>{xVals[i]}</tspan>
				<tspan x='0'
							 dy='1.1em'>{percent ? `${(yVals[i] * 100).toFixed(2)}%` : yVals[i].toLocaleString('en-US')}</tspan>
			</text>
		</g>
	{/each}
</svg>

<style>
    /* Add any custom styles here */
</style>
