<script>
	import { selectedMetricStore } from '$lib/stores/data';

	const handleClick = () => {
		if ($selectedMetricStore === 'averageBailSet') selectedMetricStore.set('bailSet');
		else if ($selectedMetricStore === 'bailSet') selectedMetricStore.set('remanded');
		else if ($selectedMetricStore === 'remanded') selectedMetricStore.set('released');
		else selectedMetricStore.set('averageBailSet');
	};

	export let text = 'sorted by';
</script>

<div class={`sort text-right`}>
	{text} <br />
	<button class={`${$selectedMetricStore}-color cursor-pointer`} on:click={handleClick}>
		{$selectedMetricStore}
		{$selectedMetricStore === 'averageBailSet' ? 'amount' : 'rate'}
	</button>
</div>
