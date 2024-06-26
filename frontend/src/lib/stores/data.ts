// $lib/stores/data.ts
import { writable } from 'svelte/store';
import type {
	CaseStats,
	County, CountyWithGeoJSON, GeoJSONData,
	Judge, MinMax, RaceOutcomesMap
} from '$lib/types';

export const allCountiesStore = writable<County[]>([]);
export const allCountiesWithGeoJSONStore = writable<CountyWithGeoJSON[]>([]);
export const geoJSONStore = writable<GeoJSONData>();
export const countiesMinMax = writable<MinMax>();
export const judgesStateMinMax = writable<MinMax>();
export const allJudgesStore = writable<Judge[]>([]);
export const allJudgesPromiseStore = writable<Promise<Judge[]> | null>(null);
export const selectedCountyStore = writable<County | null>(null);
export const bailMinMaxStore = writable<[number, number]>([0, 0]);
export const bailAmountsStore = writable<number[]>([]);
export const countyJudgesPromiseStore = writable<Promise<Judge[]> | null>(null);
export const countyJudgesStore = writable<Judge[]>([]);
export const selectedJudgeStore = writable<Judge | null>(null);
export const selectedJudgeRaceOutcomesStore = writable<RaceOutcomesMap | null>(null);

export const selectedMetricStore = writable<'bail' | 'remand' | 'release'>('bail');

export const mapDimensionsStore = writable<{ width: number; height: number }>({ width: 0, height: 0 });

export const loadingStore = writable<boolean>(true);

export const selectedStatsStore = writable<'state' | 'county' | 'judge'>('state');

export const showCountyJudgesStore = writable<boolean>(true);
export const countyRemandMinMaxPctStore = writable<[number, number]>([0, 0]);
export const countyReleaseMinMaxPctStore = writable<[number, number]>([0, 0]);


export const stateBailCases = {
	totalBailSetAmount: 4309524656,
	bailSetCases: 125076,
	remandCases: 31023,
	rorCases: 522768,
	nmrCases: 102121,
	unknownCases: 110516,
	totalCases: 891342,
	averageBailAmount: 4834.87
};

export const stateBailCasesPct = {
	bailSetCasesPct: stateBailCases.bailSetCases / stateBailCases.totalCases,
	remandCasesPct: stateBailCases.remandCases / stateBailCases.totalCases,
	rorCasesPct: stateBailCases.rorCases / stateBailCases.totalCases,
	nmrCasesPct: stateBailCases.nmrCases / stateBailCases.totalCases,
	unknownCasesPct: stateBailCases.unknownCases / stateBailCases.totalCases
};
