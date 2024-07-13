import { selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';
import {
	type County,
	type CountyWithGeoJSON,
	type GeoJSONData,
	type GeoJSONFeature,
	type Judge,
	type MinMax,
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
	if (amount <= 1) {
		amount = amount * 100;
	}
	if (amount == 0) {
		return '0.00';
	}
	amount = parseFloat(String(amount));
	return amount.toFixed(2);
};

function formatMoneyValue(value: number): [string, string] {
	return formatMoney(value).split('.') as [string, string];
}


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
				return a.allCaseResults.total.remanded.percent - b.allCaseResults.total.remanded.percent;
			case SortTarget.releasePct:
				return a.allCaseResults.total.released.percent - b.allCaseResults.total.released.percent;
			case SortTarget.averageBail:
				return a.allCaseResults.total.averageBailAmount - b.allCaseResults.total.averageBailAmount;
			case SortTarget.caseCount:
				return a.allCaseResults.total.totalCases - b.allCaseResults.total.totalCases;
			case SortTarget.remandRaw:
				return a.allCaseResults.total.remanded.raw - b.allCaseResults.total.remanded.raw;
			case SortTarget.releaseRaw:
				return a.allCaseResults.total.released.raw - b.allCaseResults.total.released.raw;
			case SortTarget.bailSet:
				return a.allCaseResults.total.bailSet.raw - b.allCaseResults.total.bailSet.raw;
			case SortTarget.name:

				return a?.name.localeCompare(b.name);

			default:
				return 0;
		}
	};

	return list.sort((a, b) => (order === SortOrder.asc ? compareValues(a, b) : compareValues(b, a)));
};


/*
const getMinMax = (targets: Judge[] | County[]): MinMax => {
	const stats = targets.map((t) => t.all);

	const initialMinMax: MinMax = {
		bailAmount: [Infinity, -Infinity],
		bailSet: [Infinity, -Infinity],
		remand: [Infinity, -Infinity],
		ror: [Infinity, -Infinity],
		nmr: [Infinity, -Infinity],
		release: [Infinity, -Infinity],
		unknown: [Infinity, -Infinity]
	};

	return stats.reduce((acc: MinMax, stat) => {
		acc.bailAmount = [
			Math.min(acc.bailAmount[0], stat.averageBailSet),
			Math.max(acc.bailAmount[1], stat.averageBailSet)
		];
		acc.bailSet = [
			Math.min(acc.bailSet[0], stat.pct.bailSet),
			Math.max(acc.bailSet[1], stat.pct.bailSet)
		];
		acc.remand = [
			Math.min(acc.remand[0], stat.pct.remand),
			Math.max(acc.remand[1], stat.pct.remand)
		];
		acc.ror = [Math.min(acc.ror[0], stat.pct.ror), Math.max(acc.ror[1], stat.pct.ror)];
		acc.nmr = [Math.min(acc.nmr[0], stat.pct.nmr), Math.max(acc.nmr[1], stat.pct.nmr)];
		acc.release = [
			Math.min(acc.release[0], stat.pct.release),
			Math.max(acc.release[1], stat.pct.release)
		];
		acc.unknown = [
			Math.min(acc.unknown[0], stat.pct.unknown),
			Math.max(acc.unknown[1], stat.pct.unknown)
		];
		return acc;
	}, initialMinMax);
};*/

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
