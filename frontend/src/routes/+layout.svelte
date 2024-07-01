<script>
	import '../app.css';
	import LawVisionIcon from '../lib/components/shared/Logo.svelte';
</script>
<div class="flex-col">
	<nav class="bg-zinc-900 shadow-md ">
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
						<div class="ml-10 flex items-baseline space-x-4">
							<a href="/" class="transition rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white">Demo</a>
							<a href="about"
								 class="transition rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white">About</a>
							<a href="contact"
								 class="transition rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white">Contact</a>
						</div>
					</div>
				</div>
			</div>
		</div>

	</nav>
	<div class="flex justify-center flex-row">
		<div class="outer-container">
			<slot></slot>
		</div>
	</div>
</div>


<style>
    .outer-container {
        @apply flex flex-col p-6 w-screen sm:w-screen lg:w-screen h-full justify-between;
        background-color: rgba(39, 39, 42, 0.1);
    }
</style>
