<script lang="ts">
  import { formatMoneyValue, formatNumber, sortTopJudges, sortAllCounties } from '$lib/utils';
	import type { CountyExpandedProperties, CountyFeature, CountyProperties, JudgeExpandedProperties } from '$lib/types';
  import {
    allCountiesStore,
    selectedCountyStore,
    selectedJudgeStore,
    selectedMetricStore,
    showCountyJudgesStore,
    countyJudgesStore
  } from '$lib/stores/data';
  import Close from '$lib/assets/Close.svelte';
  import Money from '$lib/components/Money.svelte';

  let selectedCountyInfo: CountyExpandedProperties | null = null;
  let selectedJudgeInfo: JudgeExpandedProperties | null = null;
  let topJudgesPromise: Promise<JudgeExpandedProperties[]> | null = null;
  let topJudges: JudgeExpandedProperties[] = [];
  let metric: 'bail' | 'remand' | 'release' = 'bail';
  let allCounties: CountyFeature[] = [];

  // Reactive declarations
  $: metric = $selectedMetricStore;
  $: selectedJudgeInfo = $selectedJudgeStore;
  $: selectedCountyInfo = $selectedCountyStore;
  $: topJudges = $countyJudgesStore;
  $: topJudgesPromise = Promise.resolve(topJudges);
  $: allCounties = $allCountiesStore;
  $: allCountiesPromise = Promise.resolve(allCounties);

  // Sort top judges by selected metric
  $: topJudges = sortTopJudges(topJudges, metric);

  // Sort top counties by selected metric
  $: topCounties = sortAllCounties(allCounties, metric).slice(0,5);

  let hoveredStat: string | null = null;

  function handleMouseEnter(stat: string) {
    hoveredStat = stat;
  }

  function handleMouseLeave() {
    hoveredStat = null;
  }
</script>

<div class="county-detail flex-1 rounded-lg p-4 md:p-6 bg-zinc-800 hover:outline outline-zinc-700 shadow-lg flex-col flex">
  <div class="flex justify-end">
    <button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={() => showCountyJudgesStore.set(false)}>
      <Close />
    </button>
  </div>

  <h2 class="font-bold text-xl md:text-2xl text-gray-50 mb-2">Top Counties</h2>

  <div class="overflow-y-scroll">
    {#await allCountiesPromise}
      <p class="text-zinc-400">Fetching top counties...</p>
    {:then topCounties}
      {#if topCounties && topCounties.length > 0}
        <ul class="space-y-2">
          {#each topCounties.slice(0,5).map(c => c.properties) as county}
            <button on:click={() => selectedCountyStore.set(county)}
              class="list-item w-full text-left {county.county_name === selectedCountyInfo?.county_name ? 'selected' : ''}">
              <p class="text-lg text-zinc-300 font-bold pb-1">{county.name}</p>
              <div class="">
                {#if metric === 'bail'}
                  <p class="font-mono">
                    <Money value={hoveredStat === 'amount' ? county.countyProps.average_bail_set * county.countyProps.cases_bail_set : county.countyProps.average_bail_set} />
                    <span class="case-count text-zinc-300 super">
                      <p class="text-xs float-right align-super">({formatNumber(county.countyProps.cases_bail_set)} cases)</p>
                    </span>
                  </p>
                {/if}
                {#if metric === 'release'}
                  <p class="font-mono">
                    <span class="text-green-600">{formatNumber((county.cases_ror_pct + county.cases_nmr_pct) * 100)}</span>
                    <span class="text-gray-300 -ml-1">%</span>
                    <span class="case-count text-zinc-300 super">
                      <p class="text-xs float-right align-super">({formatNumber(county.countyProps.cases_ror + county.countyProps.cases_nmr)} cases)</p>
                    </span>
                  </p>
                {/if}
                {#if metric === 'remand'}
                  <p class="font-mono">
                    <span class="text-red-600">{formatNumber(county.cases_remand_pct * 100)}</span>
                    <span class="text-gray-300 -ml-1">%</span>
                    <span class="case-count text-zinc-300 super">
                      <p class="text-xs float-right align-super">({formatNumber(county.countyProps.cases_remand)} cases)</p>
                    </span>
                  </p>
                {/if}
              </div>
            </button>
          {/each}
        </ul>
      {:else}
        <p class="text-zinc-400">No counties found.</p>
      {/if}
    {:catch error}
      <p class="text-red-500">Error fetching top counties: {error.message}</p>
    {/await}
  </div>
</div>

<style>

</style>
