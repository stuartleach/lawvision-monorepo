<script>
	import '../app.css';
	import LawVisionIcon from '$lib/components/assets/Logo.svelte';
	import InfoBanner from '$lib/components/containers/InfoBanner.svelte';
	import Header from '$lib/components/layout/Header.svelte';
</script>

<div class="">
	<nav class="sticky bg-zinc-950 w-full shadow-md">

		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-[4rem] items-center justify-between">
				<div class="flex items-center">
					<div class="flex-shrink-0">

						<a href="/">
							<div class="w-full ">
								<h1
									class="font-bold t text-4xl tracking-[-.04em] bg-gradient-to-tr from-red-500 to-yellow-300 bg-clip-text font-bold text-transparent">
									LawVision</h1>
							</div>
						</a>

					</div>
					<div class="hidden md:block">
						<div class="ml-10 grid grid-cols-2 space-x-4 ">
							<a
								href="/"
								class="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white transition text-xl"
							>Home</a>
							<a
								href="mailto:jstuartleach@gmail.com"
								class="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white transition text-xl"
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
