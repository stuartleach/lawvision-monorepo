<script lang="ts">
	import SelectorContainer from '$lib/components/judge-table/JudgeTable.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	import Title from '$lib/components/shared/Title.svelte';
	import { loadingStore } from '$lib/stores/data';
</script>

{#if $loadingStore}
	<div class="loading">Loading...</div>
{:else}
	<SelectorContainer />
{/if}

<style>
</style>
