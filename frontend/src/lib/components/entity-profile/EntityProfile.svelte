<script lang="ts">
	import ChargesGrid from '$lib/components/entity-focus/ChargesGrid.svelte';
	import ProfileHeader from '$lib/components/entity-focus/EntityInfoHeader.svelte';
	import ProfileVisualizations from '$lib/components/entity-profile/ProfileVisualizations.svelte';
	import type { County, Judge } from '$lib/types/frontendTypes';

	export let entity: Judge | County;

</script>

<div class="flex flex-col *:h-1/3">
	<ProfileHeader {entity} />
	<ProfileVisualizations entity={entity} />
	<ChargesGrid {entity} />
</div>
