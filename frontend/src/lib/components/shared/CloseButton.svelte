<script lang="ts">
	import CloseIcon from '$lib/components/shared/CloseIcon.svelte';
	import type { County } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let store: Writable<County | null> | null = null;
	export let hide: Writable<boolean> | null = null;

	const handleClick = () => {
		store?.set(null);
		hide?.set(false);
	};
</script>

<button class="x-button -mr-1 w-4" on:click={handleClick}>
	<CloseIcon />
</button>
