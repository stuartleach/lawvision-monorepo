<div class="rounded-2xl p-4 grid grid-cols-3">
	<div></div>
	<div class="text-left">
		<div class="bg-clip-text text-transparent bg-gradient-to-bl py-1 text-4xl font-bold tracking-tight text-white">
			<slot name="title" />
		</div>
		<div class="text-zinc-300 font-semibold flex py-2 w-full">
			<slot name="subtitle" />
		</div>
		<div class="text-zinc-400 text-sm font-mono mt-2 flex w-full font-light">
			<slot name="subtext" />
		</div>
		<div class="text-zinc-400 text-sm font-mono mt-2 -mb-6 flex w-full font-light">
			<slot name="source" />
		</div>
	</div>
	<div></div>
</div>
