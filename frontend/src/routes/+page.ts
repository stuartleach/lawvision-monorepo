import type { CountyFeature, CountyJsonData, CountyProperties } from '$lib/types';
import { getAllJudges, getCounties } from '$lib/api';
import {
	allCountiesStore,
	bailAmountsStore,
	bailMinMaxStore,
	countyJudgesStore,
	loadingStore,
	countyBailSetAmountsStore,
	countyReleaseAmountsStore,
	countyRemandAmountsStore,
	countyUnknownAmountsStore,
	countyRemandMinMaxPctStore,
	countyBailSetMinMaxPctStore,
	countyReleaseMinMaxPctStore,
	countyUnknownMinMaxPctStore, allJudgesStore
} from '$lib/stores/data';

/** @type {import('../../.svelte-kit/types/src/routes').PageLoad} */
export async function load({ fetch, params }) {
	loadingStore.set(true);

	try {
		const newYorkCountyGeoJson: CountyJsonData = await fetch('/ny-counties.json').then(res => res.json());
		const countyPretrialData: CountyProperties[] = await getCounties(fetch);
		const allJudges = await getAllJudges(fetch, 500);







		let bailMinMax: [number, number] = [0, 0];
		let bailAmounts: number[] = [];
		let bailSetMinMaxPct: [number, number] = [Infinity, -Infinity];
		let bailSetAmounts: number[] = [];
		let remandMinMaxPct: [number, number] = [Infinity, -Infinity];
		let remandAmounts: number[] = [];
		let releaseMinMaxPct: [number, number] = [Infinity, -Infinity];
		let releaseAmounts: number[] = [];
		let unknownMinMaxPct: [number, number] = [Infinity, -Infinity];
		let unknownAmounts: number[] = [];

		const processedFeatures = newYorkCountyGeoJson.features.map((county) => {
			const matchingResult = countyPretrialData.find(cos => cos.county_name === county.properties.name);
			const bailAmount = matchingResult?.average_bail_set ?? 0;
			bailAmounts.push(bailAmount);
			const bailSetAmount = matchingResult?.cases_bail_set ?? 0;
			bailSetAmounts.push(bailSetAmount);
			const remandAmount = matchingResult?.cases_remand ?? 0;
			remandAmounts.push(remandAmount);
			const unknownAmount = matchingResult?.cases_unknown ?? 0;
			unknownAmounts.push(unknownAmount);
			const rorAmount = matchingResult?.cases_ror ?? 0;
			const nmrAmount = matchingResult?.cases_nmr ?? 0;
			const releaseAmount = rorAmount + nmrAmount;
			releaseAmounts.push(releaseAmount);
			const totalCases = bailSetAmount + remandAmount + releaseAmount + unknownAmount;

			// Calculate percentages
			const bailSetPct = bailSetAmount / totalCases;
			bailSetMinMaxPct = [Math.min(bailSetPct, bailSetMinMaxPct[0]), Math.max(bailSetPct, bailSetMinMaxPct[1])];
			const remandPct = remandAmount / totalCases;
			remandMinMaxPct = [Math.min(remandPct, remandMinMaxPct[0]), Math.max(remandPct, remandMinMaxPct[1])];
			const releasePct = releaseAmount / totalCases;
			releaseMinMaxPct = [Math.min(releasePct, releaseMinMaxPct[0]), Math.max(releasePct, releaseMinMaxPct[1])];
			const unknownPct = unknownAmount / totalCases;
			unknownMinMaxPct = [Math.min(unknownPct, unknownMinMaxPct[0]), Math.max(unknownPct, unknownMinMaxPct[1])];
			const nmrPct = nmrAmount / totalCases;
			const rorPct = rorAmount / totalCases;

			return {
				...county,
				properties: {
					...county.properties,
					cases_remand_pct: remandPct,
					cases_ror_pct: rorPct,
					cases_bail_set_pct: bailSetPct,
					cases_unknown_pct: unknownPct,
					cases_nmr_pct: nmrPct,
					countyProps: {
						...county.properties,
						number_of_cases: matchingResult?.number_of_cases ?? 0,
						average_bail_set: matchingResult?.average_bail_set ?? 0,
						cases_bail_set: matchingResult?.cases_bail_set ?? 0,
						cases_ror: matchingResult?.cases_ror ?? 0,
						cases_remand: matchingResult?.cases_remand ?? 0,
						cases_unknown: matchingResult?.cases_unknown ?? 0,
						cases_nmr: matchingResult?.cases_nmr ?? 0
					}
				}
			} as CountyFeature;
		});

		allCountiesStore.set(processedFeatures);
		bailMinMax = [Math.min(...bailAmounts), Math.max(...bailAmounts)];
		bailMinMaxStore.set(bailMinMax);
		bailAmountsStore.set(bailAmounts);
		countyBailSetMinMaxPctStore.set(bailSetMinMaxPct);
		countyBailSetAmountsStore.set(bailSetAmounts);
		countyRemandMinMaxPctStore.set(remandMinMaxPct);
		countyRemandAmountsStore.set(remandAmounts);
		countyReleaseMinMaxPctStore.set(releaseMinMaxPct);
		countyReleaseAmountsStore.set(releaseAmounts);
		countyUnknownMinMaxPctStore.set(unknownMinMaxPct);
		countyUnknownAmountsStore.set(unknownAmounts);
		console.log(allJudges)
		allJudgesStore.set(allJudges);

		loadingStore.set(false);
	} catch (error) {
		console.error('Error fetching or processing county data:', error);
		loadingStore.set(false);
	}

	return {
		// Return data if necessary
	};
}
