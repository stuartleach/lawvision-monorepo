import type { County, GeoJSONData } from '$lib/types/types';
import { getGeoJson, getCounties, getJudges } from '$lib/api';
import {
	allCountiesStore,
	loadingStore,
	allJudgesStore, countiesMinMax, judgesStateMinMax, geoJSONStore, allCountiesWithGeoJSONStore
} from '$lib/stores/data';
import { combineCountiesWithGeoJSON, getMinMax } from '$lib/utils';

/** @type {import('./$types').PageLoad} */



export async function load({ fetch, params }) {
	loadingStore.set(true);
	try {
		const newYorkGeoJson: GeoJSONData = await getGeoJson({ fetch });
		const counties: County[] = await getCounties({ fetch });
		const judges = await getJudges({ fetch, countyId: '', limit: 100 });

		geoJSONStore.set(newYorkGeoJson);
		allCountiesStore.set(counties);
		allJudgesStore.set(judges);
		countiesMinMax.set(getMinMax(counties));
		judgesStateMinMax.set(getMinMax(judges));
		allCountiesWithGeoJSONStore.set(combineCountiesWithGeoJSON(counties, newYorkGeoJson));

		loadingStore.set(false);
	} catch (error) {
		console.error('Error fetching or processing county data:', error);
		loadingStore.set(false);
	}
}
