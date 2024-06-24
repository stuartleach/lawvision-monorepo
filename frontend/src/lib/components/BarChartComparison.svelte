<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedCountyStore, selectedJudgeStore, selectedStatsStore } from '$lib/stores/data.js';
	import type { CountyProperties, JudgeProperties } from '$lib/types';
	import * as d3 from 'd3';

	let selectedJudgeInfo: JudgeProperties | null = null;
	let countySelectedInfo: CountyProperties | null = null;

	$: selectedJudgeInfo = $selectedJudgeStore;
	$: countySelectedInfo = $selectedCountyStore;

	const stateAverageBail = 5000; // Example value, replace with actual state data
	const stateBailSetCount = 124914; // Example value, replace with actual state data

	let judgeAverageBail = 0;
	let judgeBailSetCount = 0;
	let countyAverageBail = 0;
	let countyBailSetCount = 0;

	$: {
		if (selectedJudgeInfo) {
			judgeAverageBail = selectedJudgeInfo.average_bail_set ?? 0;
			judgeBailSetCount = selectedJudgeInfo.cases_bail_set ?? 0;
		}

		if (countySelectedInfo) {
			countyAverageBail = countySelectedInfo.average_bail_set ?? 0;
			countyBailSetCount = countySelectedInfo.cases_bail_set ?? 0;
		}
	}

	let svg;
	let width = 400;
	let height = 400;
	let margin = { top: 20, right: 30, bottom: 40, left: 40 };

	function renderChart() {
		const data = [
			{ category: 'Average Bail', judge: judgeAverageBail, county: countyAverageBail, state: stateAverageBail },
			{ category: 'Bail Set Count', judge: judgeBailSetCount, county: countyBailSetCount, state: stateBailSetCount }
		];

		const x0 = d3.scaleBand()
			.domain(data.map(d => d.category))
			.rangeRound([margin.left, width - margin.right])
			.paddingInner(0.1);

		const x1 = d3.scaleBand()
			.domain(['judge', 'county', 'state'])
			.rangeRound([0, x0.bandwidth()])
			.padding(0.05);

		const y = d3.scaleLinear()
			.domain([0, d3.max(data, d => Math.max(d.judge, d.county, d.state))]).nice()
			.rangeRound([height - margin.bottom, margin.top]);

		const color = d3.scaleOrdinal()
			.domain(['judge', 'county', 'state'])
			.range(['#1f77b4', '#ff7f0e', '#2ca02c']);

		const xAxis = g => g
			.attr('transform', `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x0).tickSizeOuter(0));

		const yAxis = g => g
			.attr('transform', `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).ticks(null, 's'));

		svg.selectAll('*').remove();

		svg.append('g')
			.selectAll('g')
			.data(data)
			.join('g')
			.attr('transform', d => `translate(${x0(d.category)},0)`)
			.selectAll('rect')
			.data(d => ['judge', 'county', 'state'].map(key => ({ key, value: d[key] })))
			.join('rect')
			.attr('x', d => x1(d.key))
			.attr('y', d => y(d.value))
			.attr('width', x1.bandwidth())
			.attr('height', d => y(0) - y(d.value))
			.attr('fill', d => color(d.key));

		svg.append('g')
			.call(xAxis);

		svg.append('g')
			.call(yAxis);

		svg.append('g')
			.selectAll('g')
			.data(data)
			.join('g')
			.attr('transform', d => `translate(${x0(d.category)},0)`)
			.selectAll('text')
			.data(d => ['judge', 'county', 'state'].map(key => ({ key, value: d[key] })))
			.join('text')
			.attr('x', d => x1(d.key) + x1.bandwidth() / 2)
			.attr('y', d => y(d.value) - 5)
			.attr('text-anchor', 'middle')
			.text(d => d.value);
	}

	onMount(() => {
		svg = d3.select('#barChart')
			.attr('width', width)
			.attr('height', height);

		renderChart();
	});

	$: selectedJudgeInfo, countySelectedInfo, renderChart();
</script>

<svg id="barChart"></svg>

<style>
    /* Add any custom styles here */
</style>
