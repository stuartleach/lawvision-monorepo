// $lib/stores/data.ts
import {
	type County,
	type CountyWithGeoJSON,
	type GeoJSONData,
	type Judge,
	type MinMax,
	type NewYorkState,
	type Race,
	type SeverityLevel, SortOrder,
	SortTarget
} from '$lib/types/frontendTypes';
import { writable } from 'svelte/store';

// Styling //
export const darkMode = writable<boolean>(true);
export const currentPageStore = writable<'judges' | 'counties' | 'state' | 'contact'>('judges');
export const currentListTargetStore = writable<'judges' | 'counties'>('judges');
export const selectedEntityStore = writable<Judge | County | null>(null);

export const graphTargetDataStore = writable<{
	metric: string,
	severity: SeverityLevel,
	race: Race,
	val: 'percent' | 'amount' | 'raw'
}>({ metric: 'bailSet', severity: 'Any', race: 'Any', val: 'percent' });

// Counties //
export const allCountiesStore = writable<County[]>([]);
export const allCountiesWithGeoJSONStore = writable<CountyWithGeoJSON[]>([]);
export const countiesMinMaxStore = writable<MinMax>();
export const geoJSONStore = writable<GeoJSONData>();
export const newYorkStateStore = writable<NewYorkState | null>(null);

export const selectionStore = writable({
	county: null,
	severity: null,
	race: null,
	direction: null,
	metric: null
});

// Judges //
export const allJudgesStore = writable<Judge[]>([]);
export const countyJudgesStore = writable<Judge[]>([]);
export const judgesStateMinMax = writable<MinMax>();
export const countyJudgesPromiseStore = writable<Promise<Judge[]> | null>(null);

// Filters //
export const judgeNameFilterStore = writable<string>('');
export const countyNameFilterStore = writable<string>('');
export const defendantRaceFilterStore = writable<string>('Any');
export const chargeSeverityFilterStore = writable<string>('Any');

// Bail //
export const bailAmountsStore = writable<number[]>([]);
export const bailMinMaxStore = writable<[number, number]>([0, 0]);

// Stateful //
export const loadingStore = writable<boolean>(true);
export const selectedMetricStore = writable<SortTarget>(SortTarget.averageBailAmount);
export const mapDimensionsStore = writable<{ width: number; height: number }>({
	width: 1000,
	height: 1000
});

export const sortTargetStore = writable<SortTarget>(SortTarget.bailSet);
export const sortOrderStore = writable<SortOrder>(SortOrder.asc);
export const filterSeverityStore = writable<SeverityLevel>('Any');
export const filterRaceStore = writable<Race>('Any');
export const deviationStore = writable<boolean>(false);

export const selectedCountyStore = writable<County | null>(null);
export const selectedJudgeStore = writable<Judge | null>(null);

export const races = ['Any', 'White', 'Black', 'American Indian/Alaskan Native', 'Asian/Pacific Islander', 'Other', 'Unknown'];
export const severityLevels: SeverityLevel[] = ['Any', 'AF', 'BF', 'CF', 'DF', 'EF', 'AM', 'BM', 'I', 'V', 'UM'];
export const severityLabels: Record<string, string> = {
	'Any': 'All Charges',
	'AF': 'A Felony',
	'BF': 'B Felony',
	'CF': 'C Felony',
	'DF': 'D Felony',
	'EF': 'E Felony',
	'AM': 'A Misdemeanor',
	'BM': 'B Misdemeanor',
	'I': 'Infraction',
	'V': 'Violation',
	'UM': 'Unknown'
};

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
