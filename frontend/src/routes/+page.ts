import { getCounties, getGeoJson, getJudges } from '$lib/api';
import {
	allCountiesStore,
	allCountiesWithGeoJSONStore,
	allJudgesStore,
	countiesMinMaxStore,
	geoJSONStore,
	judgesStateMinMax,
	loadingStore
} from '$lib/stores/data';
import type { County, GeoJSONData } from '$lib/types/frontendTypes';
import { combineCountiesWithGeoJSON, getMinMax } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	loadingStore.set(true);

	try {
		const newYorkGeoJson: GeoJSONData = await getGeoJson({ fetch });
		const counties: County[] = await getCounties({ fetch });
		const judges = await getJudges({ fetch, countyId: '', limit: 2000 });

		geoJSONStore.set(newYorkGeoJson);
		allCountiesStore.set(counties);
		allJudgesStore.set(judges);
		countiesMinMaxStore.set(getMinMax(counties));
		judgesStateMinMax.set(getMinMax(judges));
		allCountiesWithGeoJSONStore.set(combineCountiesWithGeoJSON(counties, newYorkGeoJson));

		loadingStore.set(false);
	} catch (error) {
		console.error('Error fetching or processing county data:', error);
		loadingStore.set(false);
	}
};
