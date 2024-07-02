<div class="law-container transition">
	<div class="law-container-inner w-full">
		<slot />
	</div>
</div>

<style>
    .law-container:hover {
        transform: translateY(-2px);
    }

    .law-container-inner {
        @apply rounded-lg flex sm:w-[30vw] lg:w-[30vw] w-96 flex-col p-6 pt-9 bg-zinc-800 hover:outline outline-zinc-700 transition-all;
        @apply h-full w-full;
        @apply grow-0;
        @apply flex flex-1 flex-col p-8;
        /*@apply max-h-[40rem]*/
    }

    .law-container h4 {
        @apply text-xl tracking-tight font-bold text-gray-500;
    }

    .law-container h6 {
        @apply text-end tracking-tight font-bold text-gray-500;
    }

    .law-container .sort {
        @apply float-right tracking-tight text-sm font-bold text-gray-500 -mt-2;
    }

    .law-container h2 {
        @apply text-2xl font-semibold tracking-tight text-gray-50 mb-2;
    }

</style>
