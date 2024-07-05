<script>
	import '../app.css';
	import LawVisionIcon from '$lib/components/assets/Logo.svelte';
</script>
<div class="">
	<nav class="bg-zinc-950 shadow-md fixed w-full mb-[100px]">
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
							<a href="/" class="transition rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white">Home</a>
							<a href="mailto:jstuartleach@gmail.com"
								 class="transition rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white">Contact</a>

						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
	<div class="pt-8">
		<slot />
	</div>
</div>


<style>
    /*.outer-container {*/
    /*    @apply flex flex-col p-6 w-screen;*/
    /*    @apply h-full justify-between;*/
    /*    background-color: rgba(39, 39, 42, 0.1);*/
    /*}*/
</style>
