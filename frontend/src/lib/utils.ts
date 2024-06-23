import * as d3 from 'd3';

const formatMoney = (amount: number) => {
    amount = parseFloat(String(amount));
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const formatNumber = (amount: number) => {
    amount = parseFloat(String(amount));
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function createColorScale(min: number, max: number, target: 'bail' | 'ror' | 'remand'): (value: number) => string {
    if (target === 'bail') {
        return d3.scaleLinear<string>()
            .domain([min, max])
            .range(['black', 'rgb(255, 100, 0)']);
    }
    if (target === 'ror') {
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

export { formatMoney, formatNumber, createColorScale };
