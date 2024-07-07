<script>
	import '../app.css';
	import LawVisionIcon from '$lib/components/assets/Logo.svelte';
	import InfoBanner from '$lib/components/containers/InfoBanner.svelte';
	import Header from '$lib/components/layout/Header.svelte';
</script>

<div class="">
	<nav class="sticky w-full bg-zinc-950 shadow-md">

		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-[4rem] items-center justify-between">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="h-10 w-10">
							<a href="/">
								<LawVisionIcon />
							</a>
						</div>
					</div>
					<div class="hidden md:block">
						<div class="ml-10 grid grid-cols-2 space-x-4">
							<a
								href="/"
								class="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white transition"
							>Home</a
							>
							<a
								href="mailto:jstuartleach@gmail.com"
								class="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white transition"
							>Contact</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
	<div>
		<InfoBanner />
		<slot />
	</div>
</div>
