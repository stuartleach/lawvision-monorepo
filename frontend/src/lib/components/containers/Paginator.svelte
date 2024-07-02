<script lang="ts">
	export let currentPage = 1;
	export let totalPages: () => number
	export let prevPage: () => void
	export let nextPage: () => void
	export let setPage: (page: number) => void
	export let getPageNumbers: () => number[]

</script>

<div class="grid grid-cols-3 text-zinc-500 px-20 border-t border-zinc-800 border-dotted pt-4 font-sans font-light">
	<div class="grid">
		<button on:click={() => currentPage > 1 && prevPage()} class="text-start hover:text-zinc-400 transition">
			Previous
		</button>
	</div>
	<div class="flex flex-col">
		<div class="flex flex-row justify-between font-mono">
			{#each getPageNumbers() as page}
				<button on:click={() => setPage(page)} class="hover:text-zinc-400 transition"
								class:text-zinc-200={currentPage === page}>
					{page}
				</button>
			{/each}
		</div>
	</div>
	<div class="grid">
		<button on:click={() => currentPage < totalPages() && nextPage()}
						class="text-end hover:text-zinc-400 transition">Next
		</button>
	</div>
</div>
