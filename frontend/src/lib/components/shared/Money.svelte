<script lang="ts">
	import { formatMoneyValue } from '$lib/utils';

	export let value: number = 0;
</script>

<!--<div class="wrapper">-->
	<span>$</span>
	<span>{formatMoneyValue(value)[0]}</span>
<!--</div>-->

<style>

</style>
