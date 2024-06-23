// $lib/stores/data.ts
import { writable } from 'svelte/store';
import type { CountyFeature, CountyProperties, JudgeProperties } from '$lib/types';

export const allCountiesStore = writable<CountyFeature[]>([]);
export const bailMinMaxStore = writable<[number, number]>([0, 0]);
export const bailAmountsStore = writable<number[]>([]);
export const topJudgesStore = writable<JudgeProperties[]>([]);
export const selectedCountyStore = writable<CountyProperties | null>(null);
export const selectedJudgeStore = writable<JudgeProperties | null>(null);

export const selectedMetricStore = writable<'bail' | 'remand' | 'ror'>('bail');

export const mapDimensionsStore = writable<{ width: number; height: number }>({ width: 0, height: 0 });

export const loadingStore = writable<boolean>(true);
