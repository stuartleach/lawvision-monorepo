<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { LawCard } from '$components';

	onMount(() => {
		// Set the dimensions and margins of the graph
		const margin = { top: 30, right: 30, bottom: 70, left: 60 },
			width = 1260 - margin.left - margin.right,
			height = 900 - margin.top - margin.bottom;

		// Append the SVG object to the body of the page
		const svg = d3.select('#my_dataviz')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.classed('bg-white', true);

		// Parse the Data
		d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv')
			.then(data => {
				// X axis
				const x = d3.scaleBand()
					.range([0, width])
					.domain(data.map(d => d.Country))
					.padding(0.2)

				svg.append('g')
					.classed(' bg-white ', true)
					.attr('transform', `translate(0, ${height})`)
					.call(d3.axisBottom(x))
					.selectAll('text')
					.attr('transform', 'translate(-10,0)rotate(-45)')
					.style('text-anchor', 'end');

				// Y axis
				const y = d3.scaleLinear()
					.domain([0, 13000])
					.range([height, 0]);

				svg.append('g')
					.classed(' bg-white ', true)
					.call(d3.axisLeft(y));

				// Bars
				svg.selectAll('rect')
					.classed(' bg-white ', true)
					.data(data)
					.join('rect')
					.attr('x', d => x(d.Country))
					.attr('y', d => y(d.Value))
					.attr('width', x.bandwidth())
					.attr('height', d => height - y(d.Value))
					.attr('fill', '#69b3a2');
			})
			.catch(error => {
				console.error('Error loading or parsing data:', error);
			});
	});
</script>

<!-- Create a div where the graph will take place -->
<div class="w-screen h-screen">
<!--	<LawCard>-->
		<div class="w-full h-screen z-10" id="my_dataviz"></div>
<!--	</LawCard>-->
</div>
