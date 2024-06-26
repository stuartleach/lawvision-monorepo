<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';
	import type { County, CountyWithGeoJSON, GeoJSONData } from '$lib/types/types';
	import { createColorScale, formatMoney, formatNumber } from '$lib/utils';
	import {
		allCountiesStore,
		bailMinMaxStore,
		countyRemandMinMaxPctStore,
		countyReleaseMinMaxPctStore,
		mapDimensionsStore,
		selectedCountyStore,
		selectedMetricStore,
		showCountyJudgesStore, geoJSONStore, allCountiesWithGeoJSONStore
	} from '$lib/stores/data';
	import type { Unsubscriber } from 'svelte/store';
	import { LawCard } from '$lib/components/index';

	export let selectedCountyInfo: County | null = null;

	let [min, max]: [number, number] = [0, 0];

	$: [min, max] = metric === 'bail' ? $bailMinMaxStore : metric === 'remand' ? $countyRemandMinMaxPctStore : $countyReleaseMinMaxPctStore;

	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let svg: SVGSVGElement;
	let g: SVGGElement;
	let tooltip: HTMLDivElement;
	let colorScale: any;
	let geoJSON: GeoJSONData;

	let allCountiesWithGeoJSON: CountyWithGeoJSON[];

	// let { width, height } = $mapDimensionsStore; // Get dimensions from store directly
	let { width, height } = { width: 500, height: 500 }; // Get dimensions from store directly

	$: if (geoJSON && (width || height)) {
		onMount(() => {
			updateMap();
		});
	}

	// Streamlined reactive updates
	$: selectedCountyInfo = $selectedCountyStore;
	$: selectedCountyInfo && showCountyJudgesStore.set(true);
	$: allCountiesWithGeoJSON = $allCountiesWithGeoJSONStore;
	$: geoJSON = $geoJSONStore;
	$: metric = $selectedMetricStore;

	$: console.log('geoJSON:', geoJSON);
	$: console.log('allCountiesWithGeoJSON:', allCountiesWithGeoJSON);
	$: console.log('allCountiesWithGeoJSON[0].geoJsonFeature:', allCountiesWithGeoJSON[0]?.geoJsonFeature); // Make sure it's safe to access
	$: console.log('width:', width, 'height:', height);


	$: if (geoJSON && (width || height)) {
		updateMap();
	}
	const updateMap = () => {
		if (!allCountiesWithGeoJSON.length || !svg || !g) return;

		// Ensure the correct min and max values are used based on the selected metric
		[min, max] = metric === 'bail' ? $bailMinMaxStore : metric === 'remand' ? $countyRemandMinMaxPctStore : $countyReleaseMinMaxPctStore;

		colorScale = createColorScale(min, max, metric);
		const projection = d3.geoMercator().fitSize([width - 80, height - 80], {
			type: 'FeatureCollection',
			features: allCountiesWithGeoJSON.map(c => c.geoJsonFeature)
		});

		const pathGenerator = d3.geoPath().projection(projection); // Update the path generator with the new projection

		d3.select(svg)
			.select('g')
			.selectAll<SVGPathElement, CountyWithGeoJSON>('path.county')  // Explicitly type the selection
			.data(allCountiesWithGeoJSON, (d) => d.geoJsonFeature.properties.geoid) // Key function for efficient updates
			.join(
				(enter) => enter
					.append('path')
					.attr('class', 'county')
					.attr('d', (d) => pathGenerator(d.geoJsonFeature)),
				(update) => update
					.attr('d', (d) => pathGenerator(d.geoJsonFeature))
					.attr('fill', (d) => {
						const value =
							metric === 'bail' ? d.county.stats.averageBailSet :
								metric === 'remand' ? d.county.stats.pct.remand :
									d.county.stats.pct.release;
						return colorScale(value);
					}),
				(exit) => exit.remove()
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
				const value = metric === 'bail' ? county.stats.averageBailSet :
					metric === 'remand' ? county.stats.pct.remand :
						county.stats.pct.release; // Assuming there is a pct.release
				const tooltipValue = formatNumber(value);
				const metricLabel = `${metric.charAt(0).toUpperCase() + metric.slice(1)} ${metric === 'bail' ? 'amount' : 'rate'}`;

				d3.select(tooltip)
					.style('left', `${event.pageX}px`)
					.style('top', `${event.pageY - 40}px`)
					.style('visibility', 'visible')
					.html(`
                    <div class="text-white flex-col">
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
	};


	$: if (min && max) {
		colorScale = createColorScale(min, max, metric);
	}

	let mapContainer: HTMLDivElement;

	// const resizeMapContainer = () => {
	// 	if (mapContainer) {
	// 		width = mapContainer.clientWidth;
	// 		height = mapContainer.clientHeight;
	// 		updateMap();
	// 		mapDimensionsStore.set({ width: width - 80, height: height - 80 });
	// 	}
	// };
	//
	//
	// onMount(() => {
	// 	const resizeObserver = new ResizeObserver(resizeMapContainer);
	// 	resizeObserver.observe(mapContainer);
	// 	updateMap();
	// });


</script>

<LawCard class="w-full h-full">
	{#if $geoJSONStore && $allCountiesWithGeoJSONStore && $mapDimensionsStore}
		<svg class="p-8" bind:this={svg}>
			<g bind:this={g}></g>
		</svg>
	{:else}
		<p>Loading map...</p>
	{/if}
	<div bind:this={tooltip} class="tooltip rounded absolute" style="visibility: hidden; position: absolute;"></div>
</LawCard>

