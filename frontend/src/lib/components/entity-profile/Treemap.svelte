<script lang="ts">
  import { allCountiesStore, allJudgesStore, severityLabels } from '$lib/stores/data.js';
  import type { Race, SeverityLevel } from '$lib/types/frontendTypes';
  import { metricVerbs } from '$lib/utils/misc';
  import { mutateDataForZoomableBarGraph } from '$lib/utils/mutate';
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  let svgContainer: HTMLDivElement;
  let metric = 'remanded';
  let val = 'percent';
  let severity: SeverityLevel = 'Any';
  let race: Race = 'Any';

  const width = 928;
  const height = 924;

  function tile(node, x0, y0, x1, y1) {
    d3.treemapBinary(node, 0, 0, width, height);
    for (const child of node.children) {
      child.x0 = x0 + (child.x0 / width) * (x1 - x0);
      child.x1 = x0 + (child.x1 / width) * (x1 - x0);
      child.y0 = y0 + (child.y0 / height) * (y1 - y0);
      child.y1 = y0 + (child.y1 / height) * (y1 - y0);
    }
  }

  function uid(name: string) {
    return `uid-${name}-${Math.random().toString(36).substring(2, 9)}`;
  }

  $: counties = $allCountiesStore;
  $: judges = $allJudgesStore;

  onMount(() => {
    const data = mutateDataForZoomableBarGraph({
      config: { metric: 'bailSet' },
      data: { counties, judges }
    });

    console.log('Generated Data:', JSON.stringify(data, null, 2)); // Debugging line

    const svg = d3.select(svgContainer).append('svg')
      .attr('viewBox', [0.5, -30.5, width, height + 30])
      .attr('width', width)
      .attr('height', height + 30)
      .attr('style', 'max-width: 100%; height: auto;')
      .style('font', '10px sans-serif');

    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([0, height]);

    const treemap = d3.treemap().tile(tile).size([width, height]).padding(1);

    function calculateAverage(node) {
      if (!node.children || node.children.length === 0) {
        return { sum: node.data.value, count: 1 };
      }
      let sum = 0;
      let count = 0;
      node.children.forEach(child => {
        const childData = calculateAverage(child);
        sum += childData.sum;
        count += childData.count;
      });
      node.value = sum / count;
      return { sum, count };
    }

    const root = d3.hierarchy(data, d => d.children)
      .eachBefore(d => {
        d.data.value = (d.data.value !== undefined) ? d.data.value : 0;
      })
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    calculateAverage(root);

    treemap(root);

    let group = svg.append('g').call(render, root);

    function render(group, root) {
      const nodes = root.children ? root.children.concat(root) : [root];

      const node = group
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

      node.filter(d => d === root ? d.parent : d.children)
        .attr('cursor', 'pointer')
        .on('click', (event, d) => d === root ? zoomout(root) : zoomin(d));

      node.append('title').text(d => `${name(d)}\n${format(d.value)}`);

      node.append('rect')
        .attr('id', d => (d.leafUid = uid('leaf')))
        .attr('fill', d => d === root ? '#fff' : d.children ? '#ccc' : '#ddd')
        .attr('stroke', '#fff')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0);

      node.append('clipPath')
        .attr('id', d => (d.clipUid = uid('clip')))
        .append('use')
        .attr('xlink:href', d => `#${d.leafUid}`);

      node.append('text')
        .attr('clip-path', d => `url(#${d.clipUid})`)
        .attr('font-weight', d => d === root ? 'bold' : null)
        .selectAll('tspan')
        .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
        .join('tspan')
        .attr('x', 3)
        .attr('y', (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr('fill-opacity', (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .attr('font-weight', (d, i, nodes) => i === nodes.length - 1 ? 'normal' : null)
        .text(d => d);

      group.call(position, root);
    }

    function position(group, root) {
      group.selectAll('g')
        .attr('transform', d => d === root ? `translate(0,-30)` : `translate(${d.x0},${d.y0})`)
        .select('rect')
        .attr('width', d => d === root ? width : d.x1 - d.x0)
        .attr('height', d => d === root ? 30 : d.y1 - d.y0);
    }

    function zoomin(d) {
      const group0 = group.attr('pointer-events', 'none');
      const group1 = group = svg.append('g').call(render, d);

      x.domain([d.x0, d.x1]);
      y.domain([d.y0, d.y1]);

      svg.transition().duration(750)
        .call(t => group0.transition(t).remove().call(position, d.parent))
        .call(t => group1.transition(t).attrTween('opacity', () => d3.interpolate(0, 1)).call(position, d));
    }

    function zoomout(d) {
      const group0 = group.attr('pointer-events', 'none');
      const group1 = group = svg.insert('g', '*').call(render, d.parent);

      x.domain([d.parent.x0, d.parent.x1]);
      y.domain([d.parent.y0, d.parent.y1]);

      svg.transition().duration(750)
        .call(t => group0.transition(t).remove().attrTween('opacity', () => d3.interpolate(1, 0)).call(position, d))
        .call(t => group1.transition(t).call(position, d.parent));
    }

    function name(d) {
      return d.ancestors().reverse().map(d => d.data.name).join('/');
    }

    function format(d) {
      return d3.format('.2f')(d);
    }
  });

</script>

<div class="mb-32">
  <div bind:this={svgContainer} class="w-full h-full relative">
    {#if metric === 'bailSet' && val === 'amount'}
      <div class="text-center tracking-tight justify-center text-zinc-400 text-xl mb-8">
        <b class="text-zinc-300">Average bail set</b> in <b class="text-zinc-300">{severity === 'Any' ? 'all' : severityLabels[severity]}</b> cases.
      </div>
    {:else}
      <div class="text-center tracking-tight justify-center text-zinc-400 text-xl mb-8">
        Percent of <b class="text-zinc-300">{severity === 'Any' ? 'all' : severityLabels[severity]}</b> cases where
        <b class="text-zinc-300">{race !== 'Any' ? 'defendant is ' + race + ' and ' : ''}</b>
        <b class="text-zinc-300">{metricVerbs[metric].toLowerCase()}</b>.
      </div>
    {/if}
  </div>
</div>
