<script lang="ts">
	import SelectorContainer from '$lib/components/judge-table/JudgeTable.svelte';
	import { loadingStore } from '$lib/stores/data';
</script>

<div>
	{#if $loadingStore}
		<div class="loading">Loading...</div>
	{:else}
		<SelectorContainer />
	{/if}

</div>
<style>
</style>
