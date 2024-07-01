<script lang="ts">
	import CloseIcon from '$lib/components/shared/CloseIcon.svelte';
	import type { Writable } from 'svelte/store';

	export let store: Writable<any> | null = null;
	export let hide: Writable<boolean> | null = null;

	const handleClick = () => {
		store?.set(null);
		hide?.set(false);
	};

</script>

<button class="x-button mb-4 -mr-1 -mt-2 w-4" on:click={handleClick}>
	<CloseIcon />
</button>
