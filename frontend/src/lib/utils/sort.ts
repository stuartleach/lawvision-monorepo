import {
	type County,
	type Judge,
	type Race,
	type SeverityLevel,
	SortOrder,
	SortTarget
} from '$lib/types/frontendTypes';

export const sortListByTargetGivenRaceAndSeverity = (
	listRaw: Judge[] | County[],
	target: SortTarget,
	order: SortOrder = SortOrder.desc,
	severity: SeverityLevel = 'Any',
	race: Race = 'Any',
	deviation: boolean = false,
	minCases: number = 50
) => {
	// Store Reset (unchanged)
	// selectedJudgeStore.set(null);
	// selectedCountyStore.set(null);

	const list = listRaw.filter((item) => item.arraignmentResults[severity].Any.totalCases >= minCases);

	// Centralized Metric Retrieval Function
	const getMetricValue = (item: Judge | County): number | string | null => {
		const targetData = item.arraignmentResults?.[severity]?.[race];
		switch (target) {
			case SortTarget.averageBailAmount:
				return targetData?.bailSet?.amount || null; // Default to null if not found
			case SortTarget.totalCases:
				return targetData?.totalCases || null;
			case SortTarget.remanded:
				return targetData?.remanded?.percent || null;
			case SortTarget.released:
				return targetData?.released?.percent || null;
			case SortTarget.bailSet:
				return targetData?.bailSet?.percent || null;
			case SortTarget.name:
				return item.name || '';
			default:
				return null;
		}
	};


	const getDeviationFromAverageRace = (item: Judge | County): number | null => {
		const targetData = item.arraignmentResults?.[severity]?.[race];
		const avgData = item.arraignmentResults?.[severity]?.['Any'];

		if (targetData === undefined || avgData === undefined) {
			return null; // Handle missing data for deviation
		}
		switch (target) {
			case SortTarget.averageBailAmount:
				return targetData.bailSet.amount - avgData.bailSet.amount;
			case SortTarget.totalCases:
				return (targetData?.totalCases || 0) - (avgData?.totalCases || 0);
			case SortTarget.remanded:
				return (targetData?.remanded?.percent || 0) - (avgData?.remanded?.percent || 0);
			case SortTarget.released:
				return (targetData?.released?.percent || 0) - (avgData?.released?.percent || 0);
			case SortTarget.bailSet:
				return (targetData?.bailSet?.percent || 0) - (avgData?.bailSet?.percent || 0);
			case SortTarget.name:
				return 0; // No deviation for names
			default:
				return 0;
		}
	};

	// Comparison Function with Logging
	const compareValues = (a: Judge | County, b: Judge | County): number => {
		const aVal = deviation && race !== 'Any' ? getDeviationFromAverageRace(a) : getMetricValue(a);
		const bVal = deviation && race !== 'Any' ? getDeviationFromAverageRace(b) : getMetricValue(b);

		// Handle null values by placing them at the end in descending order or the beginning in ascending order
		if (aVal === null) return order === SortOrder.desc ? 1 : -1;
		if (bVal === null) return order === SortOrder.desc ? -1 : 1;

		if (typeof aVal === 'number' && typeof bVal === 'number') {
			return order === SortOrder.asc ? bVal - aVal : aVal - bVal;
		} else {
			return order === SortOrder.asc
				? String(bVal).localeCompare(String(aVal))
				: String(aVal).localeCompare(String(bVal));
		}
	};

	// Sorting and Logging
	const result = list.sort(compareValues);
	return result;
};
