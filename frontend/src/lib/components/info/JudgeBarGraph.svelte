<script lang="ts">
  import BarGraph from '$lib/components/visualizers/BarGraph.svelte';
  import { selectedJudgeStore, allCountiesStore } from '$lib/stores/data';
  import { onMount } from 'svelte';
  import type { Judge, County } from '$lib/types/frontendTypes';

  let selectedJudgeInfo: Judge | null = null;
  let countyName: string | undefined;
  let county: County | undefined;

  $: selectedJudgeInfo = $selectedJudgeStore;
  $: countyName = selectedJudgeInfo?.primaryCounty;
  $: county = $allCountiesStore.find(c => c.name === countyName);
</script>

<div class="flex w-full border-t-2 border-zinc-500 pt-2 mt-2 text-gray-50">
  <div class="flex w-full flex-col h-full">
    <BarGraph judge={selectedJudgeInfo} county={county} />
  </div>
</div>
