<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { getData } from '../../api';

  let width = 960;
  let height = 600;
  let updatedCounties = [];
  let bailMinMax = [0, 0];
  let svg;
  let g;
  let tooltip;

  const formatMoney = (amount) => {
    amount = parseFloat(String(amount));
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  const formatNumber = (amount) => {
    return amount.toString(10).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  onMount(async () => {
    try {
      const geojsonData = await fetch('/ny-counties.geojson').then((res) => res.json());
      const countyResponse = await getData('counties');
      const updatedData = geojsonData.features.map((county) => {
        const matchingResult = countyResponse.find((cos) => cos.county_name === county.properties.name);
        return {
          ...county,
          properties: {
            ...county.properties,
            number_of_cases: matchingResult?.number_of_cases || 0,
            average_bail_amount: matchingResult?.average_bail_amount || 0,
          },
        };
      });

      updatedCounties = updatedData;
      const bailAmounts = updatedData.map((c) => c.properties.average_bail_amount);
      if (bailAmounts.length > 0 && bailAmounts.some((amount) => !isNaN(amount))) {
        bailMinMax = [Math.min(...bailAmounts), Math.max(...bailAmounts)];
      } else {
        console.warn('Bail amounts are invalid or empty. Using default range.');
        bailMinMax = [0, 0];
      }
      updateMap();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  const updateMap = () => {
    if (updatedCounties.length > 0 && svg && g) {
      const colorScale = d3.scaleLinear().domain(bailMinMax).range(['blue', 'red']);
      const projection = d3.geoMercator().fitSize([width, height], {
        type: 'FeatureCollection',
        features: updatedCounties
      });
      const pathGenerator = d3.geoPath().projection(projection);
      const zoom = d3.zoom().scaleExtent([0.5, 8]).on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

      d3.select(svg).call(zoom);

      d3.select(g)
        .selectAll('path')
        .data(updatedCounties, (d) => d.properties.geoid)
        .join('path')
        .attr('class', 'county')
        .attr('d', pathGenerator)
        .attr('fill', (d) => colorScale(d.properties.average_bail_amount))
        .attr('stroke', 'rgba(55, 65, 81, 0.75)')
        .on('mouseover', (event, d) => {
          d3.select(event.currentTarget)
            .attr('stroke', 'white')
            .raise();

          d3.select(tooltip)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY + 10}px`)
            .style('visibility', 'visible')
            .style('background-color', colorScale(d.properties.average_bail_amount))
            .html(`
              <div class="card fill-amber-600">
                <h3 class="font-bold fill-amber-200">${d.properties.name} County</h3>
                <p class="text-zinc-400">Average bail amount:
                  <span class="font-bold text-white">${formatMoney(d.properties.average_bail_amount)}</span>
                </p>
                <p class="text-zinc-400">Number of cases:
                  <span class="font-bold text-white">${formatNumber(d.properties.number_of_cases)}</span>
                </p>
              </div>
            `);
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget).attr('stroke', 'rgba(55, 65, 81, 0.75)');
          d3.select(tooltip).style('visibility', 'hidden');
        });
    }
  };
</script>

<style>
  .tooltip {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    background-color: white;
    border: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
</style>

<svg bind:this={svg} width={width} height={height} style="border: solid 1px white;">
  <g bind:this={g}></g>
</svg>
<div bind:this={tooltip} class="tooltip"></div>

