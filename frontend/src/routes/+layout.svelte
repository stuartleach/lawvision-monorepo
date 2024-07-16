<script>
	import '../app.css';
	import InfoBanner from '$lib/components/containers/InfoBanner.svelte';
</script>

<div class="">
	<nav class="sticky bg-zinc-950 w-full shadow-md">

		<div class="mx-auto mx-4 px-4 sm:px-6 lg:px-8">
			<div class="flex h-[4rem] items-center justify-between">
				<div class="flex items-center w-full justify-between">
					<div class="flex-shrink-0 flex-row ">

						<div class="w-full ">
							<a href="/">
								<h1
									class="font-bold t text-4xl tracking-[-.04em] bg-gradient-to-tr from-red-500 to-yellow-300 bg-clip-text font-bold text-transparent">
									LawVision</h1>
							</a>
						</div>

					</div>
					<div class="hidden md:block">
						<div class="ml-10 grid grid-cols-2 space-x-4 ">
							<a
								href="mailto:jstuartleach@gmail.com"
								class="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white transition text-base"
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
