<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';
	import type { CountyProperties, CountyFeature } from '$lib/types';
	import { createColorScale, formatMoney } from '$lib/utils';
	import {
		allCountiesStore,
		bailMinMaxStore,
		mapDimensionsStore,
		selectedCountyStore,
		selectedMetricStore
	} from '$lib/stores/data';
	import type { Unsubscriber } from 'svelte/store';

	export let allCounties: CountyFeature[] = [];
	export let selectedCountyInfo: CountyProperties | null = null;
	let bailMinMaxArray: [number, number] = [0, 0];

	let metric: 'bail' | 'remand' | 'ror' = 'bail';
	let svg: SVGSVGElement;
	let g: SVGGElement;
	let tooltip: HTMLDivElement;
	let colorScale: any;

	let [min, max] = bailMinMaxArray;

	let { width, height } = { width: 100, height: 800 };

	$: [min, max] = $bailMinMaxStore;
	$: selectedCountyInfo = $selectedCountyStore;
	$: allCounties = $allCountiesStore;
	$: metric = $selectedMetricStore;
	$: metric && updateMap();
	$: width = $mapDimensionsStore.width;
	$: height = $mapDimensionsStore.height;
	$: (width || height) && updateMap();

	const updateMap = () => {
		if (!allCounties.length || !svg || !g) return;
		let colorScale = createColorScale(min, max, metric);
		const colorScaleToolTip = createColorScale(min, max, 'bail');

		const projection = d3.geoMercator().fitSize([width, height], {
			type: 'FeatureCollection',
			features: allCounties
		});
		const pathGenerator = d3.geoPath().projection(projection);

		d3.select(svg)
			.select('g')
			.selectAll('path')
			.data(allCounties, (d) => (d as CountyFeature).properties.geoid)
			.join(
				(enter) => enter.append('path')
					.attr('class', 'county')
					.attr('d', pathGenerator as any),
				(update) => update.transition().attr('d', pathGenerator),
				(exit) => exit.remove()
			)
			.attr('fill', (d) => {
				return colorScale((d as CountyFeature).properties.average_bail_amount);
			})
			.attr('stroke', 'rgba(55, 65, 81, 0.15)')
			.on('click', (event, d: CountyFeature) => {
				selectedCountyStore.set(d.properties as CountyProperties);
			})
			.on('mouseover', (event, d: CountyFeature) => {
				d3.select(event.currentTarget)
					.attr('stroke', 'rgba(255, 255, 255, 0.4)')
					.attr('stroke-width', 1)
					.attr('stroke-linejoin', 'round')
					.attr('style', 'cursor:pointer')
					.attr('classes','hover:outline hover:scale-150 outline-zinc-700 shadow-lg');
				const countyName = (d as CountyFeature).properties.name;
				const [pageX, pageY] = [event.pageX, event.pageY];
				d3.select(tooltip)
					.style('left', `${pageX as number}px`)
					.style('top', `${pageY as number - 400}px`)
					.style('visibility', 'visible')
					.style('background-color', colorScaleToolTip(d.properties.average_bail_amount))
					.html(`
                        <div class="text-white flex-col">
                            <h3 class="font-bold text-white">${countyName} County</h3>
                            <p class="text-xs">Average bail amount:</p>
                            <div class="font-mono">
                                <span class="text-green-600">$</span>
                                <span class="font-bold">${formatMoney(d.properties.average_bail_amount).split('.')[0]}</span>
                                <span class="text-gray-400 tracking-tighter text-xs align-text-top hidden">.${formatMoney(d.properties.average_bail_amount).split('.')[1]}</span>
                            </div>
                        </div>
                    `);
			})
			.on('mouseout', (event, d) => {
				d3.select(event.currentTarget).attr('stroke', 'rgba(55, 65, 81, 0.15)');
				d3.select(tooltip).style('visibility', 'hidden');
			});
	};

	$: if (bailMinMaxArray[0] && bailMinMaxArray[1]) {
		colorScale = createColorScale(bailMinMaxArray[0], bailMinMaxArray[1], metric);
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

<div class="transition h-[1000px] flex align-baseline justify-center" bind:this={mapContainer}>
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
        position: absolute;
        pointer-events: none;
        visibility: hidden;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.75);
        border-radius: 5px;
        color: white;
        font-size: 12px;
        z-index: 10;
    }
</style>
