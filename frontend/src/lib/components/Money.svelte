<script>
	import { formatMoneyValue } from '$lib/utils';

	export let value = 0;
</script>

<span class="text-green-600">$</span>
<span class="text-gray-300">{formatMoneyValue(value)[0]}</span>
<span
	class="text-gray-500 -ml-2 tracking-tighter text-xs align-text-top">.{formatMoneyValue(value)[1]}</span>
