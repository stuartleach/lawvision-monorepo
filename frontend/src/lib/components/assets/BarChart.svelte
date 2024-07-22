<script lang="ts">
	import { selectedJudgeStore, allCountiesStore, newYorkStateStore, graphTargetDataStore } from '$lib/stores/data';
	import type { Race, SeverityLevel } from '$lib/types';
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	// Chart dimensions and margins as optional props.
	let svgContainer: HTMLDivElement;

	$: judge = $selectedJudgeStore;
	$: county = $allCountiesStore.find(c => c.name === judge?.primaryCounty);
	$: state = $newYorkStateStore;
	let metric: string;
	let severity: SeverityLevel;
	let race: Race;
	let val: 'percent' | 'amount' | 'raw';

	$: graphTargetData = $graphTargetDataStore;
	$: metric = graphTargetData.metric;
	$: severity = graphTargetData.severity;
	$: race = graphTargetData.race;
	$: val = graphTargetData.val;

	$: plotData = [judge, county, state];
	$: plot = [
		[judge?.name, judge?.arraignmentResults?.[severity]?.[race]?.[metric]?.[val] as number],
		[county?.name, county?.arraignmentResults?.[severity]?.[race]?.[metric]?.[val] as number],
		['New York State', state?.arraignmentResults?.[severity]?.[race]?.[metric]?.[val] as number]
	];

	$: labels = [judge?.name || 'Judge', 'County', 'New York State'];

	export let width = 640;
	export let height = 400;
	export let marginTop = 20;
	export let marginRight = 20;
	export let marginBottom = 50;
	export let marginLeft = 40;

	let gx: SVGGElement;
	let gy: SVGGElement;
	let x;
	let y;

	function updateDimensions() {
		width = svgContainer.clientWidth;
		height = svgContainer.clientHeight;

		x = d3.scaleBand()
			.domain(plot.map(d => d[0]))
			.range([marginLeft, width - marginRight])
			.padding(0.1);

		y = d3.scaleLinear()
			.domain([0, d3.max(plot, d => d[1]) || 0])
			.nice()
			.range([height - marginBottom, marginTop]);

		const svg = d3.select(svgContainer).select('svg')
			.attr('width', width)
			.attr('height', height);

		if (gy) d3.select(gy).transition().duration(750).call(d3.axisLeft(y));
		if (gx) d3.select(gx).transition().duration(750).call(d3.axisBottom(x));

		const bars = svg.selectAll('.bar').data(plot);

		bars.enter().append('rect')
			.attr('class', 'bar')
			.attr('x', d => x(d[0]))
			.attr('y', height - marginBottom)
			.attr('width', x.bandwidth())
			.attr('height', 0)
			.merge(bars)
			.transition().duration(750)
			.attr('x', d => x(d[0]))
			.attr('y', d => y(d[1]))
			.attr('width', x.bandwidth())
			.attr('height', d => y(0) - y(d[1]))
			.attr('fill', 'currentColor');

		bars.exit().remove();

		const labels = svg.selectAll('.label').data(plot);

		labels.enter().append('text')
			.attr('class', 'label')
			.attr('x', d => x(d[0]) + x.bandwidth() / 2)
			.attr('y', height - marginBottom)
			.attr('dy', '-0.5em')
			.attr('text-anchor', 'middle')
			.merge(labels)
			.transition().duration(750)
			.attr('x', d => x(d[0]) + x.bandwidth() / 2)
			.attr('y', d => y(d[1]) - 5)
			.text(d => d[1].toFixed(2) + '%');

		labels.exit().remove();
	}

	$: {
		if (svgContainer || graphTargetData) {
			updateDimensions();
		}
	}

	onMount(() => {
		updateDimensions();
		window.addEventListener('resize', updateDimensions);

		return () => {
			window.removeEventListener('resize', updateDimensions);
		};
	});
</script>

<div bind:this={svgContainer} class="w-full h-full">
	<svg class="bg-red-500">
		<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
		<g bind:this={gy} transform="translate({marginLeft},0)" />
	</svg>
</div>
