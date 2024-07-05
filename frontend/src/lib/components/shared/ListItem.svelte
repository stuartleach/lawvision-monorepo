<script lang="ts">
	export let onMouseEnter: (() => void) | null = null;
	export let onMouseLeave: (() => void) | null = null;
	export let onClick: (() => void) | null = null;

</script>

<button class="
				flex-row items-center justify-between min-w-full flex
				text-zinc-400 mb-2
				py-2 px-4
				border-b-2 last:border-b-0
        hover:bg-zinc-700 hover:shadow-2xl
        transition-all outline-none
				cursor-pointer"
				on:click={onClick ? onClick : undefined}
				on:mouseenter={onMouseEnter ? onMouseEnter : undefined}
				on:mouseleave={onMouseLeave ? onMouseLeave : undefined}
>
	<h3 class="text-zinc-300 font-bold text-lg text-left w-[10rem]">
		<slot name="title" />
	</h3>
	<div class="font-bold text-zinc-400 text-right flex justify-end font-mono">
		<slot name="stat" />
	</div>
</button>
