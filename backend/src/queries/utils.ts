import {
	filterBailSetCases,
	filterByNotRace,
	filterByRace,
	filterReleasedCases,
	filterRemandedCases
} from '../caseFilters';

export const percentify = (num: number) => Math.round(num * 100);

export const calculatePercentages = (cases: any[], race: string) => {
	const filtered = filterByRace(cases, race);
	const notFiltered = filterByNotRace(cases, race);

	const calcPercent = (filterFn: (cs: any[]) => any[]) => percentify(filterFn(filtered).length / filtered.length) - percentify(filterFn(notFiltered).length / notFiltered.length);

	return {
		totalBailEligibleCases: filtered.length,
		bailSet: calcPercent(filterBailSetCases),
		remanded: calcPercent(filterRemandedCases),
		released: calcPercent(filterReleasedCases)
	};
};
