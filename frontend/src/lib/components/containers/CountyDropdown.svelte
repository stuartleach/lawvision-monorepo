<script lang="ts">
	import CloseButton from '$lib/components/shared/CloseButton.svelte';
	import { selectedCountyStore } from '$lib/stores/data';
	import type { County, Judge } from '$lib/types';
	import { Button, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let counties: County[];
	export let county: County | null;
	export let judges: Judge[];
	let isOpen = false;
	let selectedCountyName = $selectedCountyStore ?? 'Select a county';

	$: sortedCounties = [...counties].sort((a, b) => a.name?.localeCompare(b.name));

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectCounty(county: County) {
		selectedCountyName = county.name;
		if (selectedCountyName === $selectedCountyStore?.name) {
			selectedCountyName = 'Select a county';
			selectedCountyStore.set(null);
		}
		selectedCountyStore.set(county);
		county = county;

		judges = judges.filter((judge) => judge.county_name === county.name);
		isOpen = false;
	}

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const dropdown = document.getElementById('dropdown-button');
			if (dropdown && !dropdown.contains(event.target as Node)) {
				isOpen = false;
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div>
	<div class="relative flex flex-row align-middle h-12">
		<Button
			type="button"
			id="dropdown-button"
			class="relative w-full cursor-default rounded-md bg-zinc-700 py-1.5 pl-3 pr-10 text-left text-zinc-400 shadow-sm ring-1 ring-inset ring-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-labelledby="listbox-label"
			on:click={toggleDropdown}
		>
			<span class="block truncate">{selectedCountyName}</span>
			<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
				<svg
					class="h-5 w-5 text-gray-400"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</Button>

		{#if isOpen}
			<ul
				class="absolute z-[1000000] max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				tabindex="-1"
				role="listbox"
				aria-labelledby="listbox-label"
				aria-activedescendant="listbox-option-3"
			>
				{#each sortedCounties as county}
					<li
						class="relative z-[100000] cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
						id="listbox-option-0"
						role="option"
						aria-selected="true"
					>
						<button
							type="button"
							class="w-full text-left"
							on:click={() => selectCounty(county)}
							on:keydown={() => selectCounty(county)}
						>
							<span class="block truncate font-normal">{county.name}</span>
							{#if selectedCountyName === county.name}
								<span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
									<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
								</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
