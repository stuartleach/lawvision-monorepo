<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';
	import type { CountyProperties, CountyFeature, CountyExpandedProperties } from '$lib/types';
	import { createColorScale, formatMoney, formatNumber } from '$lib/utils';
	import {
		allCountiesStore,
		bailMinMaxStore,
		countyRemandMinMaxPctStore,
		countyReleaseMinMaxPctStore,
		mapDimensionsStore,
		selectedCountyStore,
		selectedMetricStore,
		showCountyJudgesStore
	} from '$lib/stores/data';
	import type { Unsubscriber } from 'svelte/store';

	export let allCounties: CountyFeature[] = [];
	export let selectedCountyInfo: CountyExpandedProperties | null = null;
	let minMaxArray: [number, number] = [0, 0];

	let metric: 'bail' | 'remand' | 'release' = 'bail';
	let svg: SVGSVGElement;
	let g: SVGGElement;
	let tooltip: HTMLDivElement;
	let colorScale: any;

	let [min, max] = minMaxArray;

	let { width, height } = { width: 800, height: 800 };

	$: [min, max] = metric === 'bail' ? $bailMinMaxStore : metric === 'remand' ? $countyRemandMinMaxPctStore : $countyReleaseMinMaxPctStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: selectedCountyInfo && showCountyJudgesStore.set(true);
	$: allCounties = $allCountiesStore;
	$: metric = $selectedMetricStore;
	$: metric && updateMap();
	$: width = $mapDimensionsStore.width;
	$: height = $mapDimensionsStore.height;
	$: (width || height) && updateMap();

	const updateMap = () => {
		if (!allCounties.length || !svg || !g) return;
		colorScale = createColorScale(min, max, metric);
		const colorScaleToolTip = createColorScale(min, max, metric);

		const projection = d3.geoMercator().fitSize([width, height], {
			type: 'FeatureCollection',
			features: allCounties
		});
		const pathGenerator = d3.geoPath().projection(projection);

		d3.select(svg)
			.select('g')
			.selectAll('path')
			.data(allCounties, (d) => (d as CountyFeature)?.properties?.geoid)
			.join(
				(enter) => enter.append('path')
					.attr('class', 'county')
					.attr('d', pathGenerator as any),
				(update) => update.transition().attr('d', pathGenerator),
				(exit) => exit.remove()
			)
			.attr('fill', (d) => {
				const value = metric === 'bail' ? d?.properties?.countyProps?.average_bail_set :
					metric === 'remand' ? d?.properties?.cases_remand_pct :
						d?.properties?.cases_nmr_pct + d?.properties?.cases_ror_pct;
				return colorScale(value);
			})
			.attr('stroke', 'rgba(55, 65, 81, 0.15)')
			.on('click', (event, d: CountyFeature) => {
				selectedCountyStore.set(d.properties as CountyExpandedProperties);
			})
			.on('mouseover', (event, d: CountyFeature) => {
				d3.select(event.currentTarget)
					.attr('stroke', 'rgba(255, 255, 255, 0.4)')
					.attr('stroke-width', 1)
					.attr('stroke-linejoin', 'round')
					.attr('style', 'cursor:pointer')
					.attr('classes', 'hover:outline hover:scale-150 outline-zinc-700 shadow-lg');
				const countyName = (d as CountyFeature)?.properties.name;
				const [pageX, pageY] = [event.pageX, event.pageY];
				const value = metric === 'bail' ? d?.properties?.countyProps?.average_bail_set :
					metric === 'remand' ? d?.properties?.cases_remand_pct :
						d?.properties?.cases_nmr_pct + d?.properties?.cases_ror_pct;
				const tooltipValue = metric === 'bail' ? formatMoney(value) : formatNumber(value);
				const metricLabel = metric.charAt(0).toUpperCase() + metric.slice(1) + (metric === 'bail' ? ' amount' : ' rate');

				d3.select(tooltip)
					.style('left', `${pageX as number}px`)
					.style('top', `${pageY as number - 400}px`)
					.style('visibility', 'visible')
					.style('background-color', colorScaleToolTip(value))
					.html(`
                        <div class="text-white flex-col">
                            <h3 class="font-bold text-white">${countyName} County</h3>
                            <p class="text-xs">${metricLabel}:</p>
                            <div class="font-mono">
                            ${metric === 'bail' ? '$' : ''}${metric === 'bail' ? tooltipValue : (Number(tooltipValue) * 100).toFixed()}${metric === 'bail' ? '' : '%'}
                            </div>
                        </div>
                    `);
			})
			.on('mouseout', (event, d) => {
				d3.select(event.currentTarget).attr('stroke', 'rgba(55, 65, 81, 0.15)');
				d3.select(tooltip).style('visibility', 'hidden');
			});
	};

	$: if (minMaxArray[0] && minMaxArray[1]) {
		colorScale = createColorScale(minMaxArray[0], minMaxArray[1], metric);
	}

	let mapContainer: HTMLDivElement;

	const resizeMapContainer = () => {
		if (mapContainer) {
			width = mapContainer.clientWidth;
			height = mapContainer.clientHeight;
			updateMap();
			mapDimensionsStore.set({ width: width - 80, height: height - 80 });
		}
	};

	const unsubscribeFunctions: Unsubscriber[] = [];

	onMount(() => {
		const resizeObserver = new ResizeObserver(resizeMapContainer);
		resizeObserver.observe(mapContainer);
		updateMap();
	});

	onDestroy(() => {
		unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
	});
</script>

<div class="transition justify-center flex h-[50vh] w-[20vw]" bind:this={mapContainer}>
	<div
		class="m-2 hover:-translate-y-0.5 transition w-full flex content-center flex-1 rounded-lg p-4 md:p-6 bg-zinc-800 hover:outline outline-zinc-700 shadow-lg">
		<svg class="w-full h-full p-8" bind:this={svg}>
			<g bind:this={g}></g>
		</svg>
	</div>
	<div bind:this={tooltip} class="tooltip rounded absolute" style="visibility: hidden; position: absolute;"></div>
</div>

<style>
    .tooltip {

    }
</style>
