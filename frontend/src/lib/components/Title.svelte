<div class="rounded-2xl p-8">
	<div class="flex flex-col justify-center h-full w-full">
		<div class="justify-center text-center flex w-full py-4 text-6xl font-extrabold tracking-tight text-white">
			<slot name="title" />
		</div>
		<div class="text-zinc-300 font-semibold flex justify-center py-2 w-full font-light">
			<slot name="subtitle" />
		</div>
		<div class="text-zinc-400 text-sm font-mono mt-2 flex justify-center w-full font-light">
			<slot name="subtext" />
		</div>
		<div class="text-zinc-400 text-sm font-mono mt-2 -mb-6 flex justify-center w-full font-light">
			<slot name="source" />
		</div>
	</div>
</div>
