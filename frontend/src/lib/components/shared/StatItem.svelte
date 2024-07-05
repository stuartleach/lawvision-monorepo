<script lang="ts">
	export let onMouseEnter: (() => void) | null = null;
	export let onMouseLeave: (() => void) | null = null;
	export let onClick: (() => void) | null = null;

	export let className: string = '';
</script>

<button
	class={className + ' stat-item'}
	on:click={onClick ? onClick : undefined}
	on:mouseenter={onMouseEnter ? onMouseEnter : undefined}
	on:mouseleave={onMouseLeave ? onMouseLeave : undefined}
>
	<h3>
		<slot name="title" />
	</h3>
	<div class="stat-container">
		<slot name="stat" />
	</div>
</button>
