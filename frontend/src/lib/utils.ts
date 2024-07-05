import { selectedCountyStore, selectedJudgeStore } from '$lib/stores/data';
import {
	type CaseStats,
	type County,
	type CountyWithGeoJSON,
	type GeoJSONData,
	type GeoJSONFeature,
	type Judge,
	type JudgeOrCounty,
	type MinMax,
	SortOrder,
	SortTarget
} from '$lib/types/frontendTypes';
import type { CountyModel, JudgeModel } from '$lib/types/prismaTypes';

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

const mutateCounty = (county: CountyModel): County => {
	const result = {
		medianIncome: county.median_income ?? 0,
		countyUUID: county.county_id,
		name: county.county_name,
		stats: mutateCountyStats(county)
	};
	return result;
};

const mutateCountyStats = (item: CountyModel): CaseStats => {
	return {
		averageBailSet: item.average_bail_set ?? 0,
		caseCount: item.case_count ?? 0,
		totalBailSet: (item.average_bail_set ?? 0) * (item?.case_count ?? 0),
		raw: {
			ror: item.ror_at_arraign ?? 0,
			remand: item.remand_at_arraign ?? 0,
			bailSet: item.bail_set_at_arraign ?? 0,
			unknown: item.unknown_at_arraign ?? 0,
			nmr: item.nmr_at_arraign ?? 0,
			release: (item.nmr_at_arraign ?? 0) + (item.ror_at_arraign ?? 0)
		},
		pct: {
			ror: item.percent_ror ?? 0,
			nmr: item.percent_nmr ?? 0,
			remand: item.percent_remand ?? 0,
			bailSet: item.percent_bail_set ?? 0,
			unknown: item.percent_unknown ?? 0,
			release: item.percent_release ?? 0
		},
		pctileState: {
			caseCount: item.percentile_state_case_count ?? 0,
			ror: item.percentile_state_ror ?? 0,
			nmr: item.percentile_state_nmr ?? 0,
			remand: item.percentile_state_remand ?? 0,
			bailSet: item.percentile_state_bail_set ?? 0,
			bailAmount: item.percentile_state_bail_amount ?? 0,
			unknown: item.percentile_state_unknown ?? 0,
			release: item.percentile_state_release ?? 0
		}
	};
};

const mutateJudgeStats = (item: JudgeModel): CaseStats => {
	const stats: CaseStats = {
		averageBailSet: item.average_bail_set ?? 0,
		caseCount: item.case_count ?? 0,
		totalBailSet: (item.average_bail_set ?? 0) * (item?.case_count ?? 0),
		raw: {
			ror: item.ror_at_arraign ?? 0,
			remand: item.remand_at_arraign ?? 0,
			bailSet: item.bail_set_at_arraign ?? 0,
			unknown: item.unknown_at_arraign ?? 0,
			nmr: item.nmr_at_arraign ?? 0,
			release: (item.nmr_at_arraign ?? 0) + (item.ror_at_arraign ?? 0)
		},
		pct: {
			ror: item.percent_ror ?? 0,
			nmr: item.percent_nmr ?? 0,
			remand: item.percent_remand ?? 0,
			bailSet: item.percent_bail_set ?? 0,
			unknown: item.percent_unknown ?? 0,
			release: item.percent_release ?? 0
		},
		pctileState: {
			caseCount: item.percentile_state_case_count ?? 0,
			ror: item.percentile_state_ror ?? 0,
			nmr: item.percentile_state_nmr ?? 0,
			remand: item.percentile_state_remand ?? 0,
			bailSet: item.percentile_state_bail_set ?? 0,
			bailAmount: item.percentile_state_bail_amount ?? 0,
			unknown: item.percentile_state_unknown ?? 0,
			release: item.percentile_state_release ?? 0
		},
		pctileCounty: {
			caseCount: item.percentile_county_case_count ?? 0,
			ror: item.percentile_county_ror ?? 0,
			nmr: item.percentile_county_nmr ?? 0,
			remand: item.percentile_county_remand ?? 0,
			bailSet: item.percentile_county_bail_set ?? 0,
			bailAmount: item.percentile_county_bail_amount ?? 0,
			unknown: item.percentile_county_unknown ?? 0,
			release: item.percentile_county_release ?? 0
		}
	};

	return stats;
};

export const sortListByTarget = (
	list: Judge[] | County[],
	target: SortTarget,
	order: SortOrder = SortOrder.desc
) => {
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

	const sortedList = list.sort((a, b) =>
		order === SortOrder.asc ? compareValues(a, b) : compareValues(b, a)
	);
	return sortedList;
};

const mutateJudge = (judge: JudgeModel): Judge => {
	return {
		name: judge.judge_name,
		judgeUUID: judge.judge_id,
		stats: mutateJudgeStats(judge),
		primaryCounty: judge.primary_county,
		counties: judge.counties
	};
};

const getMinMax = (targets: JudgeOrCounty[]): MinMax => {
	const stats = targets.map((t) => t.stats);

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
};

const sortBy = (
	targets: County[] | Judge[],
	metric: 'bail' | 'remand' | 'release'
): County[] | Judge[] => {
	if (targets.length === 0) {
		return [];
	}
	if (targets[0].hasOwnProperty('judgeUUID')) {
		targets = targets as Judge[];

		if (metric === 'bail') {
			targets = targets.filter((judge) => judge.stats?.raw.bailSet > 5);
		}

		if (metric === 'release') {
			targets = targets.filter((judge) => judge.stats?.raw.release > 5);
		}

		if (metric === 'remand') {
			targets = targets.filter((judge) => judge.stats?.raw.remand > 5);
		}

		return targets.sort((a, b) => {
			targets = targets as Judge[];
			if (metric === 'bail') {
				return b.stats.averageBailSet - a.stats.averageBailSet;
			} else if (metric === 'release') {
				return b.stats.pct.ror + b.stats.pct.nmr - (a.stats.pct.ror + a.stats.pct.nmr);
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
			return b.stats.pct.ror + b.stats.pct.nmr - (a.stats.pct.ror + a.stats.pct.nmr);
		} else {
			return b.stats.pct.remand - a.stats.pct.remand;
		}
	});
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
	sortBy,
	getMinMax,
	mutateJudge,
	mutateCounty,
	formatPercent
};
