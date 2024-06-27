<script lang="ts">
	import { onMount, tick } from 'svelte';
	import * as d3 from 'd3';
	import type { County, CountyWithGeoJSON, GeoJSONData, MinMax } from '$types';
	import { formatNumber } from '$utils';
	import {
		mapDimensionsStore,
		selectedCountyStore,
		selectedMetricStore,
		showCountyJudgesStore,
		geoJSONStore,
		allCountiesWithGeoJSONStore,
		countiesMinMaxStore
	} from '$data';
	import { LawCard } from '$components';

	export let selectedCountyInfo: County | null = null;

	let [min, max]: [number, number] = [0, 0];
	let countiesMinMax: MinMax = {
		bailSet: [0, 0],
		bailAmount: [0, 0],
		remand: [0, 0],
		ror: [0, 0],
		nmr: [0, 0],
		unknown: [0, 0],
		release: [0, 0]
	};

	$: countiesMinMax = $countiesMinMaxStore;
	$: [min, max] = metric === 'bail' ? countiesMinMax.bailAmount
		: metric === 'remand' ? countiesMinMax.remand
			: metric === 'release' ? countiesMinMax.release
				: countiesMinMax.unknown;

	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let svg: SVGSVGElement;
	let g: SVGGElement;
	let tooltip: HTMLDivElement;
	let colorScale: any;
	let geoJSON: GeoJSONData;
	let allCountiesWithGeoJSON: CountyWithGeoJSON[];

	let { width, height } = { width: 1000, height: 1000 };
	$: width = $mapDimensionsStore?.width ?? 1000;
	$: height = $mapDimensionsStore?.height ?? 1000;

	$: if ($mapDimensionsStore && geoJSON) {
		updateMap();
	}

	$: if (geoJSON && (width || height)) {
		updateMap();
	}

	$: selectedCountyInfo = $selectedCountyStore;
	$: selectedCountyInfo && showCountyJudgesStore.set(true);
	$: allCountiesWithGeoJSON = $allCountiesWithGeoJSONStore;
	$: geoJSON = $geoJSONStore;
	$: metric = $selectedMetricStore;

	$: if (metric) {
		[min, max] = metric === 'bail' ? countiesMinMax.bailAmount
			: metric === 'remand' ? countiesMinMax.remand
				: metric === 'release' ? countiesMinMax.release
					: countiesMinMax.unknown;
		colorScale = createColorScale(min, max, metric);
		updateMap();
	}

	function createColorScale(min: number, max: number, target: 'bail' | 'release' | 'remand'): (value: number) => string {
		if (target === 'bail') {
			return d3.scaleLinear<string>()
				.domain([min, max])
				.range(['black', 'rgb(255, 100, 0)']);
		}
		if (target === 'release') {
			return d3.scaleLinear<string>()
				.domain([min, max])
				.range(['black', 'green']);
		}
		if (target === 'remand') {
			return d3.scaleLinear<string>()
				.domain([min, max])
				.range(['black', 'red']);
		}
		return () => '';
	}

	const updateMap = () => {
		if (!allCountiesWithGeoJSON?.length || !svg || !g) return;


		const projection = d3.geoMercator().fitSize([width, height], {
			type: 'FeatureCollection',
			features: allCountiesWithGeoJSON.map(c => c.geoJsonFeature)
		});

		const pathGenerator = d3.geoPath().projection(projection);

		const paths = d3.select(svg)
			.select('g')
			.selectAll<SVGPathElement, CountyWithGeoJSON>('path.county')
			.data(allCountiesWithGeoJSON, d => d.geoJsonFeature.properties.geoid)
			.join(
				enter => enter
					.append('path')
					.attr('class', 'county')
					.attr('d', d => pathGenerator(d.geoJsonFeature))
					.attr('fill', d => {
						const value = getValueForMetric(d, metric);
						const color = colorScale(value);
						return color;
					}),
				update => update
					.attr('d', d => pathGenerator(d.geoJsonFeature))
					.attr('fill', d => {
						const value = getValueForMetric(d, metric);
						const color = colorScale(value);
						return color;
					}),
				exit => exit.remove()
			)
			.attr('stroke', 'rgba(55, 65, 81, 0.15)')
			.on('click', (_, d) => {
				selectedCountyStore.set(d.county);
			})
			.on('mouseover', (event, d) => {
				d3.select(event.currentTarget)
					.attr('stroke', 'rgba(255, 255, 255, 0.4)')
					.attr('stroke-width', 1)
					.attr('stroke-linejoin', 'round')
					.attr('style', 'cursor:pointer');
				const county = d.county;
				const value = getValueForMetric(d, metric);
				const tooltipValue = formatNumber(value);
				const metricLabel = `${metric.charAt(0).toUpperCase() + metric.slice(1)} ${metric === 'bail' ? 'amount' : 'rate'}`;

				d3.select(tooltip)
					.style('left', `${event.pageX + 10}px`)
					.style('top', `${event.pageY + 10}px`)
					.style('visibility', 'visible')
					.html(`
						<div class="bg-gray-800 text-white p-2 rounded shadow-lg">
							<h3 class="font-bold">${county.name} County</h3>
							<p class="text-xs">${metricLabel}:</p>
							<div class="font-mono">
								${metric === 'bail' ? '$' : ''}${tooltipValue}${metric === 'bail' ? '' : '%'}
							</div>
						</div>
					`);
			})
			.on('mouseout', event => {
				d3.select(event.currentTarget)
					.attr('stroke', 'rgba(55, 65, 81, 0.15)');
				d3.select(tooltip).style('visibility', 'hidden');
			});

		paths.attr('fill', d => {
			const value = getValueForMetric(d, metric);
			const color = colorScale(value);
			return color;
		});
	};

	function getValueForMetric(countyWithGeoJSON: CountyWithGeoJSON, metric: string): number {
		const county = countyWithGeoJSON.county;
		switch (metric) {
			case 'bail':
				return county.stats.averageBailSet;
			case 'remand':
				return county.stats.pct.remand;
			case 'release':
				return county.stats.pct.release;
			default:
				return county.stats.pct.unknown;
		}
	}

	onMount(async () => {
		await tick();
		updateMap();
	});

	$: if (min && max) {
		colorScale = createColorScale(min, max, metric);
	}
</script>

<LawCard>
	<div slot="data"
			 class="map-data">
		<svg bind:this={svg} class="flex justify-center inset-0" viewBox={`0 0 ${width} ${height}`}
				 preserveAspectRatio="xMidYMid meet">
			<g bind:this={g}></g>
		</svg>
		<div bind:this={tooltip} class="tooltip absolute rounded" style="visibility: hidden;"></div>
	</div>
</LawCard>

<style>
    .tooltip {
        position: absolute;
        visibility: hidden;
        pointer-events: none;
        background-color: rgba(255, 255, 255, 0.9); /* Slightly more opaque background */
        border: 2px solid rgba(255, 255, 255, 0.2);
        padding: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }

    svg {
        z-index: 9;
    }

    .county.selected {
        stroke: white;
        stroke-width: 1;
    }


</style>
