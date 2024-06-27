// $lib/stores/data.ts
import { writable } from 'svelte/store';
import type {
	CaseStats,
	County, CountyWithGeoJSON, GeoJSONData,
	Judge, MinMax, RaceOutcomesMap
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
export const mapDimensionsStore = writable<{ width: number; height: number }>({ width: 1000, height: 1000 });
export const selectedJudgeStore = writable<Judge | null>(null);
export const selectedJudgeRaceOutcomesStore = writable<RaceOutcomesMap | null>(null);
export const selectedStatsStore = writable<'state' | 'county' | 'judge'>('state');
export const showCountyJudgesStore = writable<boolean>(true);
export const sortSelectorStore = writable<'bail' | 'remand' | 'release'>('bail');






export const stateBailCases = {
	totalBailSetAmount: 4309524656,
	bailSetCases: 125076,
	remandCases: 31023,
	rorCases: 522768,
	nmrCases: 102121,
	unknownCases: 110516,
	totalCases: 891342,
	averageBailAmount: 4834.87,
	releaseCases: 624889,
};


export const stateBailCasesPct = {
	bailSetCasesPct: stateBailCases.bailSetCases / stateBailCases.totalCases,
	remandCasesPct: stateBailCases.remandCases / stateBailCases.totalCases,
	rorCasesPct: stateBailCases.rorCases / stateBailCases.totalCases,
	nmrCasesPct: stateBailCases.nmrCases / stateBailCases.totalCases,
	unknownCasesPct: stateBailCases.unknownCases / stateBailCases.totalCases,
	releasePct: stateBailCases.releaseCases / stateBailCases.totalCases
};
