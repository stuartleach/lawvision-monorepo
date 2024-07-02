import { selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';
import {
	type CaseStats,
	type County,
	type CountyWithGeoJSON, type GeoJSONData,
	type GeoJSONFeature,
	type Judge,
	type JudgeOrCounty, type JudgeOutcomes,
	type MinMax, SortOrder, SortTarget
} from '$lib/types/frontendTypes';
import type { CountyModel, JudgeModel, JudgeModelOrCountyModel } from '$lib/types/prismaTypes';

const formatMoney = (amount: number) => {
	amount = parseFloat(String(amount));
	return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const formatNumber = (amount: number | undefined) => {
	// only allow two decimal places

	if (amount === undefined) {
		return '';
	}
	amount = Math.floor(amount * 100) / 100;
	amount = parseFloat(String(amount));
	return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatPercent = (amount: number) => {
	// if amount is less than one, multiply by 100
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

export const calculateCasePercentages = (stats: CaseStats) => {
	const totalCases = stats.caseCount;

	stats.pct.bailSet = stats.raw.bailSet / totalCases;
	stats.pct.remand = stats.raw.remand / totalCases;
	stats.pct.ror = stats.raw.ror / totalCases;
	stats.pct.nmr = stats.raw.nmr / totalCases;
	stats.pct.unknown = stats.raw.unknown / totalCases;
	stats.pct.release = (stats.raw.ror + stats.raw.nmr) / totalCases;

	return stats;
};


const mutateCounty = (county: CountyModel): County => {
	const result = {
		medianIncome: county.median_income ?? 0,
		countyUUID: county.county_uuid,
		name: county.county_name,
		stats: mutateStats(county)
	};

	return result;
};

const mutateStats = (item: JudgeModelOrCountyModel): CaseStats => {
	const stats: CaseStats = {
		averageBailSet: item.average_bail_set ?? 0,
		caseCount: item.case_count ?? 0,
		totalBailSet: (item.average_bail_set ?? 0) * (item?.case_count ?? 0),
		raw: {
			ror: item.cases_ror ?? 0,
			remand: item.cases_remand ?? 0,
			bailSet: item.cases_bail_set ?? 0,
			unknown: item.cases_unknown ?? 0,
			nmr: item.cases_nmr ?? 0,
			release: (item.cases_nmr ?? 0) + (item.cases_ror ?? 0)
		},
		pct: {
			ror: 0,
			nmr: 0,
			remand: 0,
			bailSet: 0,
			unknown: 0,
			release: 0
		}
	};


	return calculateCasePercentages(stats);
};

export const sortListByTarget = (list: Judge[] | County[], target: SortTarget, order: SortOrder = SortOrder.desc) => {
	selectedJudgeStore.set(null);
	selectedCountyStore.set(null);
	const compareValues = (a: JudgeOrCounty, b: JudgeOrCounty) => {
		switch (target) {
			case SortTarget.remandPct:
				return a.stats.pct.remand - b.stats.pct.remand;
			case SortTarget.releasePct:
				return a.stats.pct.release - b.stats.pct.release;
			case SortTarget.averageBail:
				return a.stats.averageBailSet - b.stats.averageBailSet;
			case SortTarget.caseCount:
				return a.stats.caseCount - b.stats.caseCount;
			case SortTarget.remandRaw:
				return a.stats.raw.remand - b.stats.raw.remand;
			case SortTarget.releaseRaw:
				return a.stats.raw.release - b.stats.raw.release;
			case SortTarget.bailSet:
				return a.stats.raw.bailSet - b.stats.raw.bailSet;
			case SortTarget.name:
				return a.name.localeCompare(b.name);
			default:
				return 0;
		}
	};

	const sortedList = list.sort((a, b) => (order === SortOrder.asc ? compareValues(a, b) : compareValues(b, a)));
	return sortedList;
};


const mutateJudge = (judge: JudgeModel): Judge => {

	return {
		name: judge.judge_name,
		judgeUUID: judge.judge_uuid,
		stats: mutateStats(judge),
		counties: judge.counties
	};
};

const getMinMax = (targets: JudgeOrCounty[]): MinMax => {

	const stats = targets.map(t => t.stats);

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
		acc.bailAmount = [Math.min(acc.bailAmount[0], stat.averageBailSet), Math.max(acc.bailAmount[1], stat.averageBailSet)];
		acc.bailSet = [Math.min(acc.bailSet[0], stat.pct.bailSet), Math.max(acc.bailSet[1], stat.pct.bailSet)];
		acc.remand = [Math.min(acc.remand[0], stat.pct.remand), Math.max(acc.remand[1], stat.pct.remand)];
		acc.ror = [Math.min(acc.ror[0], stat.pct.ror), Math.max(acc.ror[1], stat.pct.ror)];
		acc.nmr = [Math.min(acc.nmr[0], stat.pct.nmr), Math.max(acc.nmr[1], stat.pct.nmr)];
		acc.release = [Math.min(acc.release[0], stat.pct.release), Math.max(acc.release[1], stat.pct.release)];
		acc.unknown = [Math.min(acc.unknown[0], stat.pct.unknown), Math.max(acc.unknown[1], stat.pct.unknown)];
		return acc;
	}, initialMinMax);
};


const sortBy = (targets: County[] | Judge[], metric: 'bail' | 'remand' | 'release'): County[] | Judge[] => {
	if (targets.length === 0) {
		return [];
	}
	if (targets[0].hasOwnProperty('judgeUUID')) {

		targets = targets as Judge[];

		if (metric === 'bail') {
			targets = targets.filter(judge => judge.stats?.raw.bailSet > 5);
		}

		if (metric === 'release') {
			targets = targets.filter(judge => judge.stats?.raw.release > 5);
		}

		if (metric === 'remand') {
			targets = targets.filter(judge => judge.stats?.raw.remand > 5);
		}

		return targets.sort((a, b) => {
			targets = targets as Judge[];
			if (metric === 'bail') {
				return (b.stats.averageBailSet - a.stats.averageBailSet);
			} else if (metric === 'release') {
				return (b.stats.pct.ror + b.stats.pct.nmr) - (a.stats.pct.ror + a.stats.pct.nmr);
			} else {
				return b.stats.pct.remand - a.stats.pct.remand;
			}
		});
	}

	return targets.sort((a, b) => {
		targets = targets as County[];
		if (metric === 'bail') {
			return b.stats.averageBailSet - a.stats.averageBailSet;
		} else if (metric === 'release') {
			return (b.stats.pct.ror + b.stats.pct.nmr) - (a.stats.pct.ror + a.stats.pct.nmr);
		} else {
			return b.stats.pct.remand - a.stats.pct.remand;
		}
	});
};


export function combineCountiesWithGeoJSON(counties: County[], geoJsonData: GeoJSONData): CountyWithGeoJSON[] {
	return counties.map(county => {
		// Find the GeoJSONFeature that matches the county name
		const feature: GeoJSONFeature | undefined = geoJsonData.features.find(feature => feature.properties.name === county.name);

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
	sortBy,
	getMinMax,
	mutateJudge,
	mutateCounty,
	formatPercent
};
