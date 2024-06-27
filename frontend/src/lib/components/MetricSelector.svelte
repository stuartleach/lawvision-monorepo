<script lang="ts">
	import { selectedMetricStore } from '$data';

	export let metric: string = 'bail';

	$: metric = $selectedMetricStore;
</script>

<div class="flex justify-center">
	<nav
		class="selector-nav">
		<button on:click={() => selectedMetricStore.set('bail')}
						class="text-yellow-400 {metric === 'bail' ? 'selected' : ''}">
			Bail
		</button>
		<button on:click={() => selectedMetricStore.set('release')}
						class="text-green-400 {metric === 'release' ? 'selected' : ''}">
			Release
		</button>
		<button on:click={() => selectedMetricStore.set('remand')}
						class="text-red-400 {metric === 'remand' ? 'selected' : ''}">
			Remand
		</button>
	</nav>
</div>
