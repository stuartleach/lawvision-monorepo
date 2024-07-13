import { getCounties, getGeoJson, getJudges } from '$lib/api';
import {
	allCountiesStore,
	allCountiesWithGeoJSONStore,
	allJudgesStore,
	geoJSONStore,
	loadingStore
} from '$lib/stores/data';
import type { County, GeoJSONData } from '$lib/types/frontendTypes';
import { combineCountiesWithGeoJSON } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	loadingStore.set(true);

	try {
		const newYorkGeoJson: GeoJSONData = await getGeoJson({ fetch });
		const counties: County[] = await getCounties({ fetch });
		const judges = await getJudges({ fetch });

		geoJSONStore.set(newYorkGeoJson);
		allCountiesStore.set(counties);
		allJudgesStore.set(judges);
		allCountiesWithGeoJSONStore.set(combineCountiesWithGeoJSON(counties, newYorkGeoJson));

		loadingStore.set(false);
	} catch (error) {
		console.error('Error fetching or processing county data:', error);
		loadingStore.set(false);
	}
};
