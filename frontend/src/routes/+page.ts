import type { CountyFeature, CountyJsonData, CountyProperties, JudgeProperties } from '$lib/types';
import { getCounties, getJudgesByCounty } from '$lib/api';
import { allCountiesStore, bailAmountsStore, bailMinMaxStore, topJudgesStore, loadingStore } from '$lib/stores/data';

/** @type {import('../../.svelte-kit/types/src/routes').PageLoad} */
export async function load({ fetch, params }) {
	loadingStore.set(true);

	try {
		const newYorkCountyGeoJson: CountyJsonData = await fetch('/ny-counties.json').then(res => res.json());
		const countyPretrialData: CountyProperties[] = await getCounties(fetch, 'counties');

		let bailMinMax: [number, number] = [0, 0];
		let bailAmounts: number[] = [];

		allCountiesStore.set(newYorkCountyGeoJson.features.map(county => {
			const matchingResult = countyPretrialData.find(cos => cos.county_name === county.properties.name);
			bailAmounts.push(matchingResult?.average_bail_amount ?? 0);
			return {
				...county,
				properties: {
					...county.properties,
					number_of_cases: matchingResult?.number_of_cases ?? 0,
					average_bail_amount: matchingResult?.average_bail_amount ?? 0,
					cases_set_bail: matchingResult?.cases_set_bail ?? 0,
					cases_ror: matchingResult?.cases_ror ?? 0,
					cases_remand: matchingResult?.cases_remand ?? 0,
					cases_unknown: matchingResult?.cases_unknown ?? 0,
				}
			};
		}));

		bailAmountsStore.set(bailAmounts);
		bailMinMax = [Math.min(...bailAmounts), Math.max(...bailAmounts)];
		bailMinMaxStore.set(bailMinMax);


		loadingStore.set(false);
	} catch (error) {
		console.error('Error fetching or processing county data:', error);
		loadingStore.set(false);
	}


	return {
		// fetchTopJudges
	};
}
