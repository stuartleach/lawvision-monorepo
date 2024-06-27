<script>
	import { selectedMetricStore } from '$data';

	const handleClick = () => {
		// selectedMetricStore.set('bail');
		if ($selectedMetricStore === 'bail') selectedMetricStore.set('release');
		else if ($selectedMetricStore === 'release') selectedMetricStore.set('remand');
		else selectedMetricStore.set('bail');


	};

</script>

<div class={`sort text-right`}>
	sorted by <br />
	<button class={`${$selectedMetricStore}-color cursor-pointer`} on:click={handleClick}>
		{$selectedMetricStore}
		{$selectedMetricStore === 'bail' ? 'amount' : 'rate'}
	</button>
</div>
