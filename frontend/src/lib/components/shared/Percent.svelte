<script lang="ts">
	import { formatPercent } from '$lib/utils';

	export let value: number = 0;
</script>

<div class="wrapper">
	<span class="left-of-decimal">{formatPercent(value).split('.')[0]}</span>
	<span class="percent-sign">%</span>
</div>

<style>
	.wrapper {
		/*@apply whitespace-nowrap flex space-x-1 items-center;*/
	}

	.percent-sign {
		/*@apply text-green-600;*/
	}

	.left-of-decimal {
		/*@apply text-gray-300;*/
		@apply -mr-[4px];
	}

	.right-of-decimal {
		/*@apply flex tracking-tighter text-xs align-super;*/
		/*@apply opacity-75 text-xs align-text-top;*/
	}
</style>
