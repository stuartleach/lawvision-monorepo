<script>
	import { selectedMetricStore } from '$lib/stores/data';

	const handleClick = () => {
		if ($selectedMetricStore === 'bail') selectedMetricStore.set('release');
		else if ($selectedMetricStore === 'release') selectedMetricStore.set('remand');
		else selectedMetricStore.set('bail');
	};

	export let text = 'sorted by';

</script>

<div class={`sort text-right`}>
	{text} <br />
	<button class={`${$selectedMetricStore}-color cursor-pointer`} on:click={handleClick}>
		{$selectedMetricStore}
		{$selectedMetricStore === 'bail' ? 'amount' : 'rate'}
	</button>
</div>
