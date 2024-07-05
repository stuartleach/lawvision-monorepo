<div class="grid grid-cols-3 rounded-2xl p-4">
	<div></div>
	<div class="text-left">
		<div
			class="bg-gradient-to-bl bg-clip-text py-1 text-4xl font-bold tracking-tight text-transparent text-white"
		>
			<slot name="title" />
		</div>
		<div class="flex w-full py-2 font-semibold text-zinc-300">
			<slot name="subtitle" />
		</div>
		<div class="mt-2 flex w-full font-mono text-sm font-light text-zinc-400">
			<slot name="subtext" />
		</div>
		<div class="-mb-6 mt-2 flex w-full font-mono text-sm font-light text-zinc-400">
			<slot name="source" />
		</div>
	</div>
	<div></div>
</div>
