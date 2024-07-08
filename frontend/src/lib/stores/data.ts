// $lib/stores/data.ts
import { writable } from 'svelte/store';
import type {
	ArraignmentStatisticsModel, BailStatisticsModel,
	County,
	CountyWithGeoJSON,
	GeoJSONData,
	Judge,
	JudgeOutcomes,
	MinMax
} from '$lib/types';

// Styling //
export const darkMode = writable<boolean>(true);

// Counties //
export const allCountiesStore = writable<County[]>([]);
export const allCountiesWithGeoJSONStore = writable<CountyWithGeoJSON[]>([]);
export const countiesMinMaxStore = writable<MinMax>();
export const geoJSONStore = writable<GeoJSONData>();

// Judges //
export const allJudgesStore = writable<Judge[]>([]);
export const allJudgesPromiseStore = writable<Promise<Judge[]> | null>(null);
export const countyJudgesStore = writable<Judge[]>([]);
export const judgesStateMinMax = writable<MinMax>();
export const countyJudgesPromiseStore = writable<Promise<Judge[]> | null>(null);

// Bail //
export const bailAmountsStore = writable<number[]>([]);
export const bailMinMaxStore = writable<[number, number]>([0, 0]);

// Stateful //
export const loadingStore = writable<boolean>(true);
export const selectedCountyStore = writable<County | null>(null);
export const selectedMetricStore = writable<'bail' | 'remand' | 'release'>('bail');
export const mapDimensionsStore = writable<{ width: number; height: number }>({
	width: 1000,
	height: 1000
});
export const selectedJudgeStore = writable<Judge | null>(null);

export const selectedJudgeArraignmentStatisticsStore = writable<ArraignmentStatisticsModel[] | null>([]);
export const selectedJudgeBailStatisticsStore = writable<BailStatisticsModel[] | null>([]);

export const selectedJudgeOutcomesStore = writable<JudgeOutcomes | null>(null);
export const selectedJudgeOutcomesPromiseStore = writable<Promise<JudgeOutcomes> | null>(null);
export const selectedStatsStore = writable<'state' | 'county' | 'judge'>('state');
export const showCountyJudgesStore = writable<boolean>(true);
export const sortSelectorStore = writable<'bail' | 'remand' | 'release'>('bail');

export const stateBailCases = {
	totalBailSet: 4309524656,
	bailSet: 125076,
	remand: 31023,
	ror: 522768,
	nmr: 102121,
	unknown: 110516,
	caseCount: 1100000,
	averageBailSet: 4834.87,
	release: 624889
};

export const stateBailCasesPct = {
	bailSet: stateBailCases.bailSet / stateBailCases.caseCount,
	remand: stateBailCases.remand / stateBailCases.caseCount,
	ror: stateBailCases.ror / stateBailCases.caseCount,
	nmr: stateBailCases.nmr / stateBailCases.caseCount,
	unknown: stateBailCases.unknown / stateBailCases.caseCount,
	release: stateBailCases.release / stateBailCases.caseCount
};
