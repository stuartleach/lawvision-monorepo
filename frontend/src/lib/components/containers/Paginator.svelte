<script lang="ts">
	export let currentPage = 1;
	export let totalPages: () => number;
	export let prevPage: () => void;
	export let nextPage: () => void;
	export let setPage: (page: number) => void;
	export let getPageNumbers: () => number[];
</script>

<div
	class="grid grid-cols-3 border-t border-dotted border-zinc-800 px-20 pt-4 font-sans font-light text-zinc-500"
>
	<div class="grid">
		<button
			on:click={() => currentPage > 1 && prevPage()}
			class="text-start transition hover:text-zinc-400"
		>
			Previous
		</button>
	</div>
	<div class="flex flex-col">
		<div class="flex flex-row justify-between font-mono">
			{#each getPageNumbers() as page}
				<button
					on:click={() => setPage(page)}
					class="transition hover:text-zinc-400"
					class:text-zinc-200={currentPage === page}
				>
					{page}
				</button>
			{/each}
		</div>
	</div>
	<div class="grid">
		<button
			on:click={() => currentPage < totalPages() && nextPage()}
			class="text-end transition hover:text-zinc-400"
			>Next
		</button>
	</div>
</div>
