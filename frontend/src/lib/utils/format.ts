import { type ArraignmentResults, SortTarget } from '$lib/types/frontendTypes';

const formatMoney = (amount: number) => {
	amount = parseFloat(String(amount));
	return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
const formatNumber = (amount: number | undefined) => {
	if (amount === undefined) {
		return '';
	}
	amount = Math.floor(amount * 100) / 100;
	amount = parseFloat(String(amount));
	return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const formatPercent = (amount: number) => {

	amount = Math.ceil(parseFloat(String(amount)));
	return amount.toFixed(2);
};

function formatMoneyValue(value: number): [string, string] {
	return formatMoney(value).split('.') as [string, string];
}

export const convertSortTargetToMetric = (target: SortTarget): keyof ArraignmentResults | 'averageBailAmount' => {
	switch (target) {
		case SortTarget.averageBailAmount:
			return 'averageBailAmount';
		case SortTarget.totalCases:
			return 'totalCases';
		case SortTarget.remanded:
			return 'remanded';
		case SortTarget.released:
			return 'released';
		case SortTarget.bailSet:
			return 'bailSet';
		default:
			return 'averageBailAmount';
	}
};
export { formatMoneyValue };
export { formatPercent };
export { formatNumber };
export { formatMoney };
