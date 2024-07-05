<script lang="ts">
	export let targetBool = false;
	export let valueWhenNotHovered = '';
	export let valueWhenHovered = '';
</script>

<span>
	{#if targetBool}
		{valueWhenHovered}
	{:else}
		{valueWhenNotHovered}
	{/if}
</span>
