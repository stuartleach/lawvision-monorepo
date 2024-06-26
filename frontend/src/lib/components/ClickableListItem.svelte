<script lang="ts">
	export let onMouseEnter: (() => void) | null = null;
	export let onMouseLeave: (() => void) | null = null;
	export let onClick: (() => void) | null = null;
</script>

<li>
	<button
		class="w-full stat"
		on:click={onClick ? onClick : undefined}
		on:mouseenter={onMouseEnter ? onMouseEnter : undefined}
		on:mouseleave={onMouseLeave ? onMouseLeave : undefined}
	>
		<h3 class="text-lg text-zinc-300 font-bold">
			<slot name="title" />
		</h3>
		<div class="font-bold text-zinc-400">
			<slot name="stat" />
		</div>
	</button>
</li>
