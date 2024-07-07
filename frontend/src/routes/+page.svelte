<script lang="ts">
	import SelectorContainer from '$lib/components/judge-table/JudgeTable.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import { loadingStore } from '$lib/stores/data';
</script>

{#if $loadingStore}
	<div class="loading">Loading...</div>
{:else}
	<SelectorContainer />
{/if}

<style>
</style>
