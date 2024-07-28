<script lang="ts">
	import {
		allCountiesStore,
		graphTargetDataStore,
		newYorkStateStore,
		selectedJudgeStore,
		severityLabels
	} from '$lib/stores/data';
	import type { ArraignmentResultsByRace } from '$lib/types/frontendTypes';
	import { formatNumber } from '$lib/utils/format';
	import { metricClasses, metricVerbs } from '$lib/utils/misc';
	import * as d3 from 'd3';
	import { afterUpdate, onMount } from 'svelte';

	// Chart dimensions and margins as optional props.
	let svgContainer: HTMLDivElement;

	$: judge = $selectedJudgeStore;
	$: county = $allCountiesStore.find(c => c.name === judge?.primaryCounty);
	$: state = $newYorkStateStore;

	$: graphTargetData = $graphTargetDataStore;
	$: metric = graphTargetData.metric;
	$: severity = graphTargetData.severity;
	$: race = graphTargetData.race;
	$: val = graphTargetData.val;

	const races = ['Any', 'Black', 'White', 'Asian/Pacific Islander', 'American Indian/Alaskan Native', 'Other', 'Unknown'];

	const getAllRaceStatsForMetric = (stats: ArraignmentResultsByRace, metric: string, val: string) => {
		const raceStats = {};
		races.forEach(race => {
			raceStats[race] = stats?.[race]?.[metric]?.[val];
		});
		return raceStats;
	};

	$: judgeStats = getAllRaceStatsForMetric(judge?.arraignmentResults?.[severity], metric, val);
	$: countyStats = getAllRaceStatsForMetric(county?.arraignmentResults?.[severity], metric, val);
	$: stateStats = getAllRaceStatsForMetric(state?.arraignmentResults?.[severity], metric, val);

	$: plot = [
		{
			name: judge?.name,
			stats: judgeStats,
			rawStats: getAllRaceStatsForMetric(judge?.arraignmentResults?.[severity], metric, 'raw'),
			totalCases: judge?.arraignmentResults?.[severity]?.Any?.totalCases
		},
		{
			name: county?.name,
			stats: countyStats,
			rawStats: getAllRaceStatsForMetric(county?.arraignmentResults?.[severity], metric, 'raw'),
			totalCases: county?.arraignmentResults?.[severity]?.Any?.totalCases
		},
		{
			name: 'New York State',
			stats: stateStats,
			rawStats: getAllRaceStatsForMetric(state?.arraignmentResults?.[severity], metric, 'raw'),
			totalCases: state?.arraignmentResults?.[severity]?.Any?.totalCases
		}
	];

	const metricLabels: Record<string, string> = {
		bailSet: 'Bail Set',
		remanded: 'Remanded',
		released: 'Released',
		averageBailAmount: 'Average Bail Amount',
		totalCases: 'Total Cases'
	};


	$: labels = [judge?.name || 'Judge', county?.name || 'County', 'New York State'];

	export let width = 640;
	export let height = 400;
	export let marginTop = 20;
	export let marginRight = 20;
	export let marginBottom = 50;
	export let marginLeft = 60;
	export let entity: any;

	let gx: SVGGElement | null;
	let gy: SVGGElement | null;
	let yLabel: SVGTextElement | null;
	let x0;
	let x1;
	let y;

	function updateDimensions() {
		if (!svgContainer) return;

		width = svgContainer.clientWidth;
		height = svgContainer.clientHeight;

		x0 = d3.scaleBand()
			.domain(plot.map(d => d.name))
			.range([marginLeft, width - marginRight])
			.paddingInner(0.3); // Increased spacing between groups

		x1 = d3.scaleBand()
			.domain(races.slice(1)) // Exclude "Any" from the secondary scale
			.range([0, x0.bandwidth()])
			.padding(0.05);

		y = d3.scaleLinear()
			.domain([0, d3.max(plot, entity => d3.max(races, race => entity?.stats[race])) || 0])
			.nice()
			.range([height - marginBottom, marginTop]);

		const svg = d3.select(svgContainer).select('svg')
			.attr('width', width)
			.attr('height', height);

		if (gy) d3.select(gy).transition().duration(750).call(d3.axisLeft(y));
		if (gx) d3.select(gx).transition().duration(750).call(d3.axisBottom(x0).tickFormat((d, i) => labels[i])).style('font-size', `1rem`);

		svg.selectAll('.tick text').style('fill', '#a1a1aa'); // Apply Tailwind's zinc-400 color

		if (yLabel) {
			d3.select(yLabel).remove();
		}
		yLabel = svg.append('text')
			.attr('transform', `rotate(-90)`)
			.attr('y', marginLeft / 3)
			.attr('x', -height / 2)
			.attr('dy', '0.5em')
			.attr('text-anchor', 'middle')
			.style('fill', 'white')
			.style('font-size', '1rem')
			.text(metric === 'bailSet' && val === 'amount' ? metricLabels[metric] + ' ($)' : metricLabels[metric] + ' (%)')
			.node();

		const tooltip = d3.select('body').append('div')
			.attr('class', 'tooltip')
			.style('position', 'absolute')
			.style('background', '#f9f9f9')
			.style('border', '1px solid #d3d3d3')
			.style('padding', '5px')
			.style('border-radius', '3px')
			.style('pointer-events', 'none')
			.style('opacity', 0);

		const barGroups = svg.selectAll('.bar-group').data(plot);

		const barGroupsEnter = barGroups.enter().append('g')
			.attr('class', 'bar-group')
			.attr('transform', d => `translate(${x0(d.name)},0)`);

		// Render 'any' bars first to ensure they are behind other bars
		const anyBars = barGroupsEnter.append('rect')
			.attr('class', 'bar any-bar')
			.attr('x', 0)
			.attr('y', height - marginBottom)
			.attr('width', x0.bandwidth())
			.attr('height', 0)
			.attr('opacity', 0.5) // Set opacity here
			.attr('fill', 'currentColor');

		anyBars.merge(barGroups.select('.any-bar'))
			.transition().duration(750)
			.attr('y', d => y(d.stats['Any']))
			.attr('height', d => y(0) - y(d.stats['Any']));

		const bars = barGroupsEnter.merge(barGroups).selectAll('.bar-race').remove();

		barGroupsEnter.merge(barGroups).selectAll('.bar-race')
			.data(d => races.slice(1).map((race, index) => ({ race, value: d.stats[race], entity: d.name, index: index })))
			.enter().append('rect')
			.attr('class', (d) => `bar bar-race ${metric === 'bailSet' && val === 'amount' ? 'fill-orange-500' : metricClasses[metric]}`)
			.attr('x', d => x1(d.race))
			.attr('y', height - marginBottom)
			.attr('width', x1.bandwidth())
			.attr('height', 0)
			.on('mouseover', function(event, d) {
				tooltip.transition().duration(200).style('opacity', .9);
				const entityIndex = plot.findIndex(entity => entity.name === d.entity);
				const totalCases = plot[entityIndex].stats['raw'];
				tooltip.html(`${d.race}<br/>${formatNumber(d.value)} ${metric === 'bailSet' && val === 'amount' ? '$' : '%'}`)
					.style('left', (event.pageX + 5) + 'px')
					.style('top', (event.pageY - 28) + 'px');
			})
			.on('mouseout', function() {
				tooltip.transition().duration(500).style('opacity', 0);
			})
			.merge(barGroups.selectAll('.bar-race'))
			.transition().duration(750)
			.attr('x', d => x1(d.race))
			.attr('y', d => y(d.value))
			.attr('width', x1.bandwidth())
			.attr('height', d => y(0) - y(d.value))
			.attr('fill', 'currentColor');

		barGroups.exit().remove();

		const anyTextLabels = svg.selectAll('.any-label').data(plot);

		anyTextLabels.enter().append('text')
			.attr('class', 'any-label')
			.attr('x', d => x0(d.name) + x0.bandwidth() / 2)
			.attr('y', marginTop)
			.attr('dy', '-0.5em')
			.attr('text-anchor', 'middle')
			.style('fill', '#a1a1aa') // Apply Tailwind's zinc-400 color
			.style('font-size', '0.75rem')
			.merge(anyTextLabels)
			.transition().duration(750)
			.attr('x', d => x0(d.name) + x0.bandwidth() / 2)
			.attr('y', marginTop)
			.text(d => `${metric === 'bailSet' && val === 'amount' ? '$ ' + formatNumber(d.stats['Any']) : formatNumber(d.stats['Any']) + ' %'}`);

		const totalCasesLabels = svg.selectAll('.total-cases-label').data(plot);

		totalCasesLabels.enter().append('text')
			.attr('class', 'total-cases-label')
			.attr('x', d => x0(d.name) + x0.bandwidth() / 2)
			.attr('y', height - marginBottom + 20)
			.attr('dy', '1em')
			.attr('text-anchor', 'middle')
			.style('fill', '#a1a1aa')
			.style('font-size', '0.75rem')
			.merge(totalCasesLabels)
			.transition().duration(750)
			.attr('x', d => x0(d.name) + x0.bandwidth() / 2)
			.attr('y', height - marginBottom + 25)
			.text(d => `${formatNumber(d.totalCases)} cases`);

		anyTextLabels.exit().remove();
		totalCasesLabels.exit().remove();
	}

	$: {
		updateDimensions();
	}

	onMount(() => {
		updateDimensions();
		window.addEventListener('resize', updateDimensions);

		return () => {
			window.removeEventListener('resize', updateDimensions);
		};
	});

	afterUpdate(() => {
		updateDimensions();
	});
</script>

<div class="h-20 mb-32">
	<div bind:this={svgContainer} class="w-[40rem] h-96">
		{#if metric === 'bailSet' && val === 'amount'}
			<div class="text-center tracking-tight justify-center text-zinc-400 text-xl mb-8">
				<b class="text-zinc-300">Average bail set</b> in <b
				class="text-zinc-300">{severity === 'Any' ? 'all' : severityLabels[severity]}</b> cases.
			</div>
		{:else}
			<div class="text-center tracking-tight justify-center text-zinc-400 text-xl mb-8">
				Percent of <b class="text-zinc-300">{severity === 'Any' ? 'all' : severityLabels[severity]}</b> cases where
				<b class="text-zinc-300">{race !== 'Any' ? 'defendant is ' + race + ' and ' : ''}</b>
				<b class="text-zinc-300">{metricVerbs[metric].toLowerCase()}</b>.
			</div>
		{/if}
		<svg class="text-zinc-400">
			<g bind:this={gx} class="x axis" transform="translate(0,{height - marginBottom})" />
			<g bind:this={gy} class="y axis" transform="translate({marginLeft},0)" />
		</svg>
		<div
			class=" text-center tracking-tight justify-start text-white font-mono flex flex-row ml-24 gap-x-28 text-sm mb-18">
		</div>
	</div>
</div>
