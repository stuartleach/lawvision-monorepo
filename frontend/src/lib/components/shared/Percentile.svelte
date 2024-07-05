<script lang="ts">

	function getOrdinalSuffix(n: number): string {
		const s = ['th', 'st', 'nd', 'rd'],
			v = n % 100;
		return (s[(v - 20) % 10] || s[v] || s[0]);
	}

	export let value: number = 0;

	$: valueInt = Math.floor(value)

	$: valueSuffix = getOrdinalSuffix(valueInt);
</script>

<div class="wrapper">
	<span>{valueInt}</span>
	<span class="right-of-decimal align-top -ml-[0.25em] font-light text-xs">{valueSuffix}</span>
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
        @apply -mr-[4px] font-bold;
    }

    .right-of-decimal {
        /*@apply flex tracking-tighter text-xs align-super;*/
        /*@apply opacity-75 text-xs align-text-top;*/
    }

</style>
