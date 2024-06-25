import type { geoJsonData, County } from '$lib/types/types';
import { getAllJudges, getAllCounties, getGeoJson } from '$lib/api';
import {
	allCountiesStore,
	loadingStore,
	allJudgesStore, countiesMinMax, judgesStateMinMax, geoJsonStore
} from '$lib/stores/data';
import { getMinMax } from '$lib/utils';

/** @type {import('./$types').PageLoad} */

export async function load({ fetch, params }) {
	loadingStore.set(true);
	try {
		const newYorkGeoJson: geoJsonData = await getGeoJson(fetch);
		const counties: County[] = await getAllCounties(fetch);
		const judges = await getAllJudges(fetch, 500);

		geoJsonStore.set(newYorkGeoJson);
		allCountiesStore.set(counties);
		allJudgesStore.set(judges);
		countiesMinMax.set(getMinMax(counties));
		judgesStateMinMax.set(getMinMax(judges));

		loadingStore.set(false);
	} catch (error) {
		console.error('Error fetching or processing county data:', error);
		loadingStore.set(false);
	}
}
