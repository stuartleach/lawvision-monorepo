<script lang="ts">
	import { formatPercent } from '$lib/utils';

	export let value: number = 0;
</script>

<div>
	<span class="left-of-decimal">{formatPercent(value).split('.')[0]}</span>
	<span>%</span>
</div>

<style>
	.left-of-decimal {
		@apply -mr-[4px];
	}
</style>
