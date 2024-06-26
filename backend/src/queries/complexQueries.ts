import { getCases, getPretrialOutcome, getRaceNameByRaceId } from './baseQueries';
import {
	ChargeSeverityOutcomesMap,
	PretrialOutcomes,
	PretrialOutcomeTypes,
	QueryOptions,
	RaceOutcomesMap
} from './queryTypes';

type RaceCount = {
	'White': number,
	'Black': number,
	'American Indian/Alaska Native': number,
	'Asian/Pacific Islander': number,
	'Other': number,
	'Unknown': number
};

type RaceResult = {
	raw: RaceCount,
	pct: RaceCount
};

const initializePretrialOutcomes = (): PretrialOutcomes => ({
	raw: {
		bail: 0,
		release: 0,
		unknown: 0,
		remand: 0
	},
	pct: {
		bail: 0,
		release: 0,
		unknown: 0,
		remand: 0
	}
});

const calculatePercentages = (raw: PretrialOutcomeTypes): PretrialOutcomeTypes => {
	const total = Object.values(raw).reduce((acc, count) => acc + count, 0);
	const pct: PretrialOutcomeTypes = {
		bail: 0,
		release: 0,
		unknown: 0,
		remand: 0
	};
	for (const key in raw) {
		if (raw.hasOwnProperty(key)) {
			pct[key as keyof PretrialOutcomeTypes] = total > 0 ? (raw[key as keyof PretrialOutcomeTypes] / total) * 100 : 0;
		}
	}
	return pct;
};

const initializeRaceCount = (): RaceCount => {
	return {
		'White': 0,
		'Black': 0,
		'American Indian/Alaska Native': 0,
		'Asian/Pacific Islander': 0,
		'Other': 0,
		'Unknown': 0
	};
};

const getNumberOfCasesOfEachRace = async (query: QueryOptions): Promise<RaceResult> => {
	console.log('query:', query);

	const cases = await getCases(query);

	const raceCount: RaceCount = initializeRaceCount();

	// Filter out cases with null race_id and fetch race names in parallel
	const racePromises = cases
		.filter(c => c.race_id !== null)
		.map(c => getRaceNameByRaceId(c.race_id as string)); // Assert non-null

	const raceNames = await Promise.all(racePromises);

	console.log('raceNames:', raceNames);

	raceNames.forEach((raceName) => {
		switch (raceName) {
			case 'White':
				raceCount['White']++;
				break;
			case 'Black':
				raceCount['Black']++;
				break;
			case 'American Indian/Alaska Native':
				raceCount['American Indian/Alaska Native']++;
				break;
			case 'Asian/Pacific Islander':
				raceCount['Asian/Pacific Islander']++;
				break;
			case 'Other':
				raceCount['Other']++;
				break;
			case 'Unknown':
			case null:  // Handling null values
			default:
				raceCount['Unknown']++;
				break;
		}
	});

	// Calculate total cases
	const totalCases = raceNames.length;

	// Calculate percentages
	const racePct: RaceCount = {
		'White': (raceCount['White'] / totalCases) * 100,
		'Black': (raceCount['Black'] / totalCases) * 100,
		'American Indian/Alaska Native': (raceCount['American Indian/Alaska Native'] / totalCases) * 100,
		'Asian/Pacific Islander': (raceCount['Asian/Pacific Islander'] / totalCases) * 100,
		'Other': (raceCount['Other'] / totalCases) * 100,
		'Unknown': (raceCount['Unknown'] / totalCases) * 100
	};

	const raceResult: RaceResult = {
		raw: raceCount,
		pct: racePct
	};

	return raceResult;
};

const getPreTrialOutcomesForEachChargeWeight = async (query: QueryOptions): Promise<ChargeSeverityOutcomesMap> => {
	const cases = await getCases({ ...query, numCases: 1000 });

	const result: ChargeSeverityOutcomesMap = {
		AF: initializePretrialOutcomes(),
		BF: initializePretrialOutcomes(),
		CF: initializePretrialOutcomes(),
		DF: initializePretrialOutcomes(),
		EF: initializePretrialOutcomes(),
		AM: initializePretrialOutcomes(),
		BM: initializePretrialOutcomes(),
		I: initializePretrialOutcomes(),
		UM: initializePretrialOutcomes(),
		unknown: initializePretrialOutcomes()
	};

	for (const c of cases) {
		const chargeWeight = c.top_charge_weight_at_arraign || 'unknown';
		if (result[chargeWeight as keyof ChargeSeverityOutcomesMap]) {
			const preTrialOutcome = await getPretrialOutcome(c.case_uuid);
			result[chargeWeight as keyof ChargeSeverityOutcomesMap].raw[preTrialOutcome] += 1;
		}
	}

	// Calculate percentages
	for (const key in result) {
		result[key as keyof ChargeSeverityOutcomesMap].pct = calculatePercentages(result[key as keyof ChargeSeverityOutcomesMap].raw);
	}

	return result;
};

const getPreTrialOutcomesForEachRace = async (query: QueryOptions): Promise<RaceOutcomesMap> => {
	const cases = await getCases(query);

	const result: RaceOutcomesMap = {
		White: initializePretrialOutcomes(),
		Black: initializePretrialOutcomes(),
		'American Indian/Alaska Native': initializePretrialOutcomes(),
		'Asian/Pacific Islander': initializePretrialOutcomes(),
		Other: initializePretrialOutcomes(),
		Unknown: initializePretrialOutcomes()
	};

	for (const c of cases) {
		let raceName: string | null = null;
		if (c && c.race_id) {
			raceName = await getRaceNameByRaceId(c.race_id);
		} else {
			raceName = 'Unknown';
		}
		const preTrialOutcome = await getPretrialOutcome(c.case_uuid);

		if (raceName && result[raceName as keyof RaceOutcomesMap]) {
			result[raceName as keyof RaceOutcomesMap].raw[preTrialOutcome] += 1;
		} else {
			result.Unknown.raw[preTrialOutcome] += 1;
		}
	}

	// Calculate percentages
	for (const key in result) {
		result[key as keyof RaceOutcomesMap].pct = calculatePercentages(result[key as keyof RaceOutcomesMap].raw);
	}

	return result;
};

type CombinedPreTrialOutcomes = {
	[chargeWeight: string]: RaceOutcomesMap
};

const getCombinedPreTrialOutcomes = async (query: QueryOptions): Promise<CombinedPreTrialOutcomes> => {
	const cases = await getCases({ ...query, numCases: 1000 });

	// Initialize combined result structure
	const combinedResult: any = {};

	for (const c of cases) {
		const chargeWeight = c.top_charge_weight_at_arraign || 'unknown';
		let raceName: string | null = null;
		if (c && c.race_id) {
			raceName = await getRaceNameByRaceId(c.race_id);
		} else {
			raceName = 'Unknown';
		}

		const preTrialOutcome = await getPretrialOutcome(c.case_uuid);

		// Initialize structures if they don't exist
		if (!combinedResult[chargeWeight]) {
			combinedResult[chargeWeight] = {
				White: initializePretrialOutcomes(),
				Black: initializePretrialOutcomes(),
				'American Indian/Alaska Native': initializePretrialOutcomes(),
				'Asian/Pacific Islander': initializePretrialOutcomes(),
				Other: initializePretrialOutcomes(),
				Unknown: initializePretrialOutcomes()
			};
		}

		if (raceName && combinedResult[chargeWeight][raceName]) {
			combinedResult[chargeWeight][raceName].raw[preTrialOutcome] += 1;
		} else {
			combinedResult[chargeWeight]['Unknown'].raw[preTrialOutcome] += 1;
		}
	}

	// Calculate percentages for combined results
	for (const chargeWeight in combinedResult) {
		for (const race in combinedResult[chargeWeight]) {
			combinedResult[chargeWeight][race].pct = calculatePercentages(combinedResult[chargeWeight][race].raw);
		}
	}

	return combinedResult;
};

export {
	getPreTrialOutcomesForEachChargeWeight,
	getPreTrialOutcomesForEachRace,
	getNumberOfCasesOfEachRace,
	getCombinedPreTrialOutcomes
};
