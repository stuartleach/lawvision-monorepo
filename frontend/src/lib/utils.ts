import type { CountyFeature, CountyProperties } from '$lib/types';
import * as d3 from 'd3';

const formatMoney = (amount: number) => {
	amount = parseFloat(String(amount));
	return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const formatNumber = (amount: number | undefined) => {
	// only allow two decimal places

	if (amount === undefined) {
		return '';
	}
	amount = Math.floor(amount * 100) / 100;
	amount = parseFloat(String(amount));
	return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function createColorScale(min: number, max: number, target: 'bail' | 'release' | 'remand'): (value: number) => string {
	if (target === 'bail') {
		return d3.scaleLinear<string>()
			.domain([min, max])
			.range(['black', 'rgb(255, 100, 0)']);
	}
	if (target === 'release') {
		return d3.scaleLinear<string>()
			.domain([min, max])
			.range(['black', 'green']);
	}
	if (target === 'remand') {
		return d3.scaleLinear<string>()
			.domain([min, max])
			.range(['black', 'red']);
	}
	return () => '';  // Return an empty function if target doesn't match any case
}

// src/utils.ts
import type { CountyExpandedProperties, JudgeExpandedProperties } from '$lib/types';

function formatMoneyValue(value: number): [string, string] {
	return formatMoney(value).split('.') as [string, string];
}

function sortTopJudges(judges: JudgeExpandedProperties[], metric: 'bail' | 'remand' | 'release'): JudgeExpandedProperties[] {
	return judges.sort((a, b) => {
		if (metric === 'bail') {
			return b.average_bail_set - a.average_bail_set;
		} else if (metric === 'release') {
			return (b.cases_ror_pct + b.cases_nmr_pct) - (a.cases_ror_pct + a.cases_nmr_pct);
		} else {
			return b.cases_remand_pct - a.cases_remand_pct;
		}
	});
}


function sortAllCounties(allCounties: CountyFeature[], metric: 'bail' | 'remand' | 'release'): CountyFeature[] {

	return allCounties.sort((a, b) => {
		if (metric === 'bail') {
			return b.properties.countyProps.average_bail_set - a.properties.countyProps.average_bail_set;
		} else if (metric === 'release') {
			return (b.properties.cases_ror_pct + b.properties.cases_nmr_pct) - (a.properties.cases_ror_pct + a.properties.cases_nmr_pct);
		} else {
			return b.properties.cases_remand_pct - a.properties.cases_remand_pct;
		}
	});
}


function sortAllJudges(allJudges: JudgeExpandedProperties[], metric: 'bail' | 'remand' | 'release'): JudgeExpandedProperties[] {
  return allJudges
    .filter(judge => {
      if (metric === 'bail') {
        return judge.cases_bail_set >= 10;
      } else if (metric === 'release') {
        return judge.cases_ror + judge.cases_nmr >= 10;
      } else {
        return judge.cases_remand >= 10;
      }
    })
    .sort((a, b) => {
      if (metric === 'bail') {
        return b.average_bail_set - a.average_bail_set;
      } else if (metric === 'release') {
        return (b.cases_ror_pct + b.cases_nmr_pct) - (a.cases_ror_pct + a.cases_nmr_pct);
      } else {
        return b.cases_remand_pct - a.cases_remand_pct;
      }
    });
}


export { formatMoney, formatNumber, createColorScale, formatMoneyValue, sortTopJudges, sortAllCounties, sortAllJudges };
