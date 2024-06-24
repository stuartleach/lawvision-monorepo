// $lib/stores/data.ts
import { writable } from 'svelte/store';
import type {
	CountyExpandedProperties,
	CountyFeature,
	CountyProperties,
	JudgeExpandedProperties,
	JudgeProperties
} from '$lib/types';

export const allCountiesStore = writable<CountyFeature[]>([]);
export const allCountiesPromiseStore = writable<Promise<CountyFeature[]> | null>(null);
export const allJudgesStore = writable<JudgeExpandedProperties[]>([]);
export const allJudgesPromiseStore = writable<Promise<JudgeExpandedProperties[]> | null>(null);
export const selectedCountyStore = writable<CountyExpandedProperties | null>(null);
export const bailMinMaxStore = writable<[number, number]>([0, 0]);
export const bailAmountsStore = writable<number[]>([]);
export const countyJudgesStore = writable<JudgeExpandedProperties[]>([]);
export const countyJudgesPromiseStore = writable<Promise<JudgeExpandedProperties[]> | null>(null);
export const selectedJudgeStore = writable<JudgeExpandedProperties | null>(null);

export const selectedMetricStore = writable<'bail' | 'remand' | 'release'>('bail');

export const mapDimensionsStore = writable<{ width: number; height: number }>({ width: 0, height: 0 });

export const loadingStore = writable<boolean>(true);

export const selectedStatsStore = writable<'state' | 'county' | 'judge'>('state');

export const chartFocusStore = writable<'bail' | 'remand' | 'nmr' | 'ror' | 'unknown'>('bail');

export const showCountyJudgesStore = writable<boolean>(true);
export const countyRemandMinMaxPctStore = writable<[number, number]>([0, 0]);
export const countyRemandAmountsStore = writable<number[]>([]);
export const countyReleaseMinMaxPctStore = writable<[number, number]>([0, 0]);
export const countyReleaseAmountsStore = writable<number[]>([]);

export const countyBailSetMinMaxPctStore = writable<[number, number]>([0, 0]);
export const countyBailSetAmountsStore = writable<number[]>([]);

export const countyUnknownMinMaxPctStore = writable<[number, number]>([0, 0]);
export const countyUnknownAmountsStore = writable<number[]>([]);
export const judgeRemandMinMaxPctStore = writable<[number, number]>([0, 0]);

export const judgeRemandAmountsStore = writable<number[]>([]);
export const judgeReleaseMinMaxPctStore = writable<[number, number]>([0, 0]);
export const judgeReleaseAmountsStore = writable<number[]>([]);

export const judgeBailSetMinMaxPctStore = writable<[number, number]>([0, 0]);
export const judgeBailSetAmountsStore = writable<number[]>([]);

export const judgeUnknownMinMaxPctStore = writable<[number, number]>([0, 0]);
export const judgeUnknownAmountsStore = writable<number[]>([]);

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
