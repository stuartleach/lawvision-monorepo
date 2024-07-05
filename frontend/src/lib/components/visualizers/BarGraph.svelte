<script lang="ts">
	import { stateBailCasesPct, stateBailCases } from '$lib/stores/data';
	import type { County, Judge } from '$lib/types';
	import * as d3 from 'd3';
	import { onMount, afterUpdate } from 'svelte'; // Import afterUpdate

	export let judge: Judge | null;
	export let county: County | undefined;
	export let metric: 'totalCases' | 'averageBail' | 'bailSet' | 'remand' | 'release';
	let statePct = stateBailCasesPct;
	let stateRaw = stateBailCases;

	// Calculate Judge's Data
	let judgeValue: number = 0;
	let countyValue: number = 0;
	let stateValue: number = 0;

	switch (metric) {
		case 'averageBail':
			judgeValue = judge?.stats?.averageBailSet || 0;
			countyValue = county?.stats?.averageBailSet || 0;
			stateValue = stateRaw.averageBailSet || 0;
			break;
		case 'bailSet':
			judgeValue = judge?.stats?.pct.bailSet || 0;
			countyValue = county?.stats?.pct.bailSet || 0;
			stateValue = statePct.bailSet || 0;
			break;
		case 'remand':
			judgeValue = judge?.stats?.pct.remand || 0;
			countyValue = county?.stats?.pct.remand || 0;
			stateValue = statePct.remand || 0;
			break;
		case 'release':
			judgeValue = judge?.stats?.pct.release || 0;
			countyValue = county?.stats?.pct.release || 0;
			stateValue = statePct.release || 0;
			break;
	}


	let data = [
		{ name: 'Judge', value: judgeValue },
		{ name: 'County', value: countyValue },
		{ name: 'State', value: stateValue }
	];

	let svg;
	let container: HTMLDivElement;  // Declare the container variable
	let margin = { top: 0, right: 0, bottom: 0, left: 0 };
	let width;
	let height = 100 - margin.top - margin.bottom;

	let chartContainerId = `bar-chart-${judge?.judgeUUID}-${metric}`;

	onMount(() => {
		createChart();
	});

	afterUpdate(() => { // Call createChart after each update
		createChart();
	});

	function createChart() {
		// Select container and get width
		const chartContainer = document.getElementById(chartContainerId);
		width = chartContainer ? chartContainer.clientWidth - margin.left - margin.right : 200;

		// Select the chart container and remove existing SVG
		d3.select(`#${chartContainerId}`).select('svg').remove();

		// Create judge-focus SVG element and append
		svg = d3.select(`#${chartContainerId}`)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		let x = d3.scaleBand()
			.domain(data.map(d => d.name))
			.range([0, width])
			.padding(0.1);

		let y = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.value) as number])
			.nice()
			.range([height, 0]);

		svg.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.style('text-anchor', 'end');
		svg.selectAll('.axis--x .domain').remove();

		svg.append('g')
			.attr('class', 'axis axis--y')
			.call(d3.axisLeft(y).ticks(5, 's'))
			.selectAll('text')
			.style('font-size', '10px');
		svg.selectAll('.axis--y .domain').remove();

		svg.selectAll('.bar')
			.data(data)
			.enter().append('rect')
			.attr('class', 'bar')
			.attr('x', d => x(d.name)!)
			.attr('width', x.bandwidth())
			.attr('y', d => y(d.value))
			.attr('height', d => height - y(d.value))
			.attr('fill', d => {
				if (d.name === 'Judge') return '#FFEB3B';
				if (d.name === 'County') return '#FFC107';
				return '#FBC02D';
			});
	}
</script>

<div class="h-full w-full" bind:this={container}>
	<div id="bar-chart-{judge?.judgeUUID}-{metric}" class=""></div>
</div>
