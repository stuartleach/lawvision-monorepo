<script lang="ts">
	import ChargesGrid from '$lib/components/judge-focus/ChargesGrid.svelte';
	import ProfileHeader from '$lib/components/judge-focus/JudgeInfoHeader.svelte';
	import type { County, Judge } from '$lib/types';

	export let entity: Judge | County

</script>

<ProfileHeader {entity} />
<ChargesGrid {entity} />
