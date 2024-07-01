export type QueryOptions = {
	countyId?: string,
	countyName?: string,
	judgeId?: string,
	judgeName?: string,
	numCases?: number
}

export type ChargeSeverityOutcomesMap = {
	'AF': PretrialOutcomes;
	'BF': PretrialOutcomes;
	'CF': PretrialOutcomes;
	'DF': PretrialOutcomes;
	'EF': PretrialOutcomes;
	'AM': PretrialOutcomes;
	'BM': PretrialOutcomes;
	'I': PretrialOutcomes;
	'UM': PretrialOutcomes;
	'unknown': PretrialOutcomes;
}

export type JudgeOutcomes = {
	charges: ChargeSeverityOutcomesMap;
	races: RaceOutcomesMap;
}

export type RaceOutcomesMap = {
	'White': PretrialOutcomes;
	'Black': PretrialOutcomes;
	'American Indian/Alaska Native': PretrialOutcomes;
	'Asian/Pacific Islander': PretrialOutcomes;
	'Other': PretrialOutcomes;
	'Unknown': PretrialOutcomes;
}

export type PretrialOutcomes = {
	raw: PretrialOutcomeTypes;
	pct: PretrialOutcomeTypes;
}

export type PretrialOutcomeTypes = {
	'bail': number;
	'release': number;
	'unknown': number;
	'remand': number;
}
