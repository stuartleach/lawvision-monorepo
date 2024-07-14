import { selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';
import {
	type ArraignmentResults,
	type County,
	type CountyWithGeoJSON,
	type GeoJSONData,
	type GeoJSONFeature,
	type Judge,
	type Race,
	type SeverityLevel,
	SortOrder,
	SortTarget
} from '$lib/types/frontendTypes';

const formatMoney = (amount: number) => {
	amount = parseFloat(String(amount));
	return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const formatNumber = (amount: number | undefined) => {
	if (amount === undefined) {
		return '';
	}
	amount = Math.floor(amount * 100) / 100;
	amount = parseFloat(String(amount));
	return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatPercent = (amount: number) => {

	amount = Math.ceil(parseFloat(String(amount)));
	return amount.toFixed(2);
};

function formatMoneyValue(value: number): [string, string] {
	return formatMoney(value).split('.') as [string, string];
}

export const getValue = (judge: Judge, metric: keyof ArraignmentResults | 'averageBailAmount', severity: SeverityLevel = 'Any', race: Race = 'Any', percent: boolean = true): number => {
	if (metric === 'totalCases') {
		return judge.arraignmentResults[severity][race].totalCases;
	} else if (metric === 'averageBailAmount') {
		return judge.arraignmentResults[severity][race].bailSet.amount;
	} else {
		if (percent) {
			return judge.arraignmentResults[severity][race][metric].percent;
		} else {
			return judge.arraignmentResults[severity][race][metric].raw;
		}
	}
};

export const sortListByTarget = (
	list: Judge[] | County[],
	target: SortTarget,
	order: SortOrder = SortOrder.desc
) => {
	selectedJudgeStore.set(null);
	selectedCountyStore.set(null);
	const compareValues = (a: Judge | County, b: Judge | County) => {
		switch (target) {
			case SortTarget.remandPct:
				return a.arraignmentResults.Any.Any.remanded.percent - b.arraignmentResults.Any.Any.remanded.percent;
			case SortTarget.releasePct:
				return a.arraignmentResults.Any.Any.released.percent - b.arraignmentResults.Any.Any.released.percent;
			case SortTarget.averageBail:
				return a.arraignmentResults.Any.Any.bailSet.amount - b.arraignmentResults.Any.Any.bailSet.amount;
			case SortTarget.caseCount:
				return a.arraignmentResults.Any.Any.totalCases - b.arraignmentResults.Any.Any.totalCases;
			case SortTarget.remandRaw:
				return a.arraignmentResults.Any.Any.remanded.raw - b.arraignmentResults.Any.Any.remanded.raw;
			case SortTarget.releaseRaw:
				return a.arraignmentResults.Any.Any.released.raw - b.arraignmentResults.Any.Any.released.raw;
			case SortTarget.bailSet:
				return a.arraignmentResults.Any.Any.bailSet.raw - b.arraignmentResults.Any.Any.bailSet.raw;
			case SortTarget.name:

				return a?.name.localeCompare(b.name);

			default:
				return 0;
		}
	};

	return list.sort((a, b) => (order === SortOrder.asc ? compareValues(a, b) : compareValues(b, a)));
};

export function combineCountiesWithGeoJSON(
	counties: County[],
	geoJsonData: GeoJSONData
): CountyWithGeoJSON[] {
	return counties.map((county) => {
		// Find the GeoJSONFeature that matches the county name
		const feature: GeoJSONFeature | undefined = geoJsonData.features.find(
			(feature) => feature.properties.name === county.name
		);

		if (!feature) {
			throw new Error(`No GeoJSONFeature found for county ${county.name}`);
		}

		return {
			county: county,
			geoJsonFeature: feature
		};
	});
}

export {
	formatMoney,
	formatNumber,
	formatMoneyValue,
	formatPercent
};
