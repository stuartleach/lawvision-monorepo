<script lang="ts">
	import { formatMoneyValue } from '$lib/utils';

	export let value: number = 0;
</script>

<div class="wrapper">
	<span class="dollar-sign">$</span>
	<span class="dollars">{formatMoneyValue(value)[0]}</span>
	<span class="cents">.{formatMoneyValue(value)[1]}</span>
</div>

<style>
    .wrapper {
        @apply whitespace-nowrap flex space-x-1 items-center;
    }

    .dollar-sign {
        @apply text-green-600;
    }

    .dollars {
        @apply text-gray-300;
    }

    .cents {
        @apply text-gray-500 flex tracking-tighter text-xs align-text-top;
    }

</style>
