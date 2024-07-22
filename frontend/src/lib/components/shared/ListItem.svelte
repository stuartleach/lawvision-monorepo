<script lang="ts">
	export let onMouseEnter: (() => void) | null = null;
	export let onMouseLeave: (() => void) | null = null;
	export let onClick: (() => void) | null = null;
</script>

<button
	class="
				mb-2 flex min-w-full cursor-pointer flex-row
				items-center justify-between
				border-b-2 px-4
				py-2 text-zinc-400
        outline-none transition-all
        last:border-b-0 hover:bg-zinc-200/20
				hover:shadow-2xl"
	on:click={onClick ? onClick : undefined}
	on:mouseenter={onMouseEnter ? onMouseEnter : undefined}
	on:mouseleave={onMouseLeave ? onMouseLeave : undefined}
>
	<h3 class="w-[10rem] text-left text-lg font-bold text-zinc-300">
		<slot name="title" />
	</h3>
	<div class="flex justify-end text-right font-mono font-bold text-zinc-400">
		<slot name="stat" />
	</div>
</button>
