<script lang="ts">
	function getOrdinalSuffix(n: number): string {
		const s = ['th', 'st', 'nd', 'rd'],
			v = n % 100;
		return s[(v - 20) % 10] || s[v] || s[0];
	}

	export let value: number = 0;

	$: valueInt = Math.floor(value);

	$: valueSuffix = getOrdinalSuffix(valueInt);
</script>

<div>
	<span>{valueInt}</span>
	<span class="-ml-[0.25em] align-top text-xs font-light">{valueSuffix}</span>
</div>
