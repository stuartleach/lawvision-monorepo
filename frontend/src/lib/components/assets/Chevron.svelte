<script lang="ts">
	import DownChevron from '$lib/components/assets/DownChevron.svelte';
	import UpChevron from '$lib/components/assets/UpChevron.svelte';

	export let direction: 'up' | 'down' = 'down';

</script>

{direction === 'down' ? <DownChevron /> : <UpChevron />}
