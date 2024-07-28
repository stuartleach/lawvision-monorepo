<script lang="ts">
	import { countyNameFilterStore, filterRaceStore, filterSeverityStore } from '$lib/stores/data';
	import type { Race } from '$lib/types/frontendTypes';
	import { onMount } from 'svelte';

	export let label = 'Select Option';
	export let options: string[] = [];
	export let type: string = '';

	let selectedOption: string = '';

	const selectOption = (option: string) => {
		switch (type) {
			case 'county':
				countyNameFilterStore.set(option)
				break;
			case 'severity':
				filterSeverityStore.set(option)
				break;
			case 'race':
				filterRaceStore.set(option as Race)
				break;
			default:
				break;
		}
		selectedOption = option;
	};

	onMount(() => {

		switch (type) {
			case 'county':
				selectedOption = $countyNameFilterStore;
				break;
			case 'severity':
				selectedOption = $filterSeverityStore;
				break;
			case 'race':
				selectedOption = $filterRaceStore;
				break;
			default:
				break;
		}
		if (type && selectedOption) {
			selectOption(selectedOption);
		}
	});

	let expanded = false;
</script>

<div>
	<label id="listbox-label" class="block text-sm font-medium leading-6 text-zinc-400">{label}</label>
	<div class="relative mt-2">
		<button
			type="button"
			class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
			aria-haspopup="listbox"
			aria-expanded={expanded}
			aria-labelledby="listbox-label"
			on:click={() => expanded = !expanded}
		>
			<span class="block truncate">{selectedOption || 'Any'}</span>
			<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
				<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fill-rule="evenodd"
								d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
								clip-rule="evenodd" />
				</svg>
			</span>
		</button>
		{#if expanded}
			<ul
				class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				tabindex="-1"
				role="listbox"
				aria-labelledby="listbox-label"
			>
				{#each (type==='county' ? ['',...options] : options) as option}
					<li
						class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
						id="listbox-option-{option}"
						role="option"
						on:click={() => { selectOption(option); expanded = false; }}
					>
						<span class="block truncate font-normal">{option || 'Any'}</span>
						{#if option === selectedOption}
							<span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
								<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
									<path fill-rule="evenodd"
												d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
												clip-rule="evenodd" />
								</svg>
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
    /* Add necessary styles here */
</style>
