<script lang="ts">
	import { Chart } from 'flowbite-svelte';
	import { allCountiesStore } from '$lib/stores/data.js';
	import type { CountyFeature } from '$lib/types';
	import { quantize, interpolatePlasma, pie, arc } from 'd3';

	// hardcoded values for now
	let totalCasesInNewYork = 891342;
	let bailSetCasesInNewYork = 124914;
	let remandCasesInNewYork = 31023;
	let rorCasesInNewYork = 522768;
	let unknownCasesInNewYork = 212637;

	let allCounties: CountyFeature[] = [];
	$: allCounties = $allCountiesStore;

	let target: 'state' | 'county' | 'judge' = 'state';

	const data = [
		{ type: 'Bail Set', value: bailSetCasesInNewYork },
		{ type: 'Remand', value: remandCasesInNewYork },
		{ type: 'ROR', value: rorCasesInNewYork },
		{ type: 'Unknown', value: unknownCasesInNewYork }
	];

	const width = 400; // outer width of the chart, in pixels
	const height = width; // outer height of the chart, in pixels
	const percent = false; // format values as percentages (true/false)
	const fontSize = 16; // font size of the x and y values
	const strokeWidth = 1; // width of stroke separating wedges
	const strokeLinejoin = 'round'; // line join style of stroke separating wedges
	const outerRadius = Math.min(width, height) * 0.5 - 60; // outer radius of the circle, in pixels
	const innerRadius = 0; // inner radius of the chart, in pixels
	const labelRadius = (innerRadius * 0.2 + outerRadius * 0.8); // center radius of labels
	const strokeColorWOR = 'white'; // stroke color when inner radius is greater than 0
	const strokeColorWIR = 'none'; // stroke color when inner radius is 0
	const stroke = innerRadius > 0 ? strokeColorWIR : strokeColorWOR; // stroke separating widths
	const padAngle = stroke === 'none' ? 1 / outerRadius : 0; // angular separation between wedges

	const xVals = data.map(d => d.type);
	let yVals = data.map(d => d.value);
	if (percent) {
		const total = yVals.reduce((a, b) => a + b, 0);
		yVals = yVals.map(val => val / total);
	}
	const iVals = data.map((_, i) => i);

	// colors can be adjusted manually by creating a color array which length matches length of data set.
	let colors = quantize(t => interpolatePlasma(t * 0.7 + 0.3), xVals.length);

	const wedges = pie().padAngle(padAngle).sort(null).value(i => yVals[i])(iVals);

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
