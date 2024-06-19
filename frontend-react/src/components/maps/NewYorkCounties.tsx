import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {Feature, Geometry} from 'geojson';
import {getData} from '../../api';

interface CountyProperties {
    county_name: string;
    countyUuid: string;
    number_of_cases: number;
    median_income: number;
    average_bail_amount: number;
    geoid: string;
    name: string;
    raceImportance: number; // Default race importance is 0
}

interface CountyFeature extends Feature<Geometry> {
    properties: CountyProperties;
}

const MapProps = {
    width: 960,
    height: 600,
};

const formatMoney = (amount: number) => {
    console.log('amount: ', amount)
    amount = parseFloat(String(amount))
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

const formatNumber = (amount: number) => {
    return amount.toString(10).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

const NewYorkCountiesMap: React.FC<typeof MapProps> = ({width, height}) => {
    const ref = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [updatedCounties, setUpdatedCounties] = useState<CountyFeature[]>([]);
    const [bailMinMax, setBailMinMax] = useState<number[]>([0, 0]);

    useEffect(() => {
        fetch('/ny-counties.geojson')
            .then((response) => response.json())
            .then((data) => setUpdatedCounties(data.features))
            .catch(console.error);
    }, []);

    useEffect(() => {
        console.log('updatedCounties: ', updatedCounties.map((c) => c))
    }, [updatedCounties]);

    useEffect(() => {
        const fetchGeoJSON = fetch('/ny-counties.geojson').then((res) => res.json());
        const fetchModelResults = getData('counties').then((res) => res as CountyProperties[]);

        Promise.all([fetchGeoJSON, fetchModelResults])
            .then(([geojsonData, countyResponse]) => {
                const updatedData = geojsonData.features.map((county: { properties: { name: string } }) => {
                    const matchingResult = countyResponse.find((cos) => cos.county_name === county.properties.name);
                    return {
                        ...county,
                        properties: {
                            ...county.properties,
                            number_of_cases: matchingResult?.number_of_cases || 0,
                            average_bail_amount: matchingResult?.average_bail_amount || 0,
                        },
                    };
                });

                setUpdatedCounties(updatedData);

                // Calculate bailMinMax here (after data is fully updated)
                const bailAmounts = updatedData.map((c: {
                    properties: { average_bail_amount: number }
                }) => c.properties.average_bail_amount);

                // Check for empty or invalid bailAmounts
                if (bailAmounts.length > 0 && bailAmounts.some((amount: number) => !isNaN(amount))) {
                    setBailMinMax([Math.min(...bailAmounts), Math.max(...bailAmounts)]);
                } else {
                    console.warn('Bail amounts are invalid or empty. Using default range.');
                    setBailMinMax([0, 0]); // Or some other reasonable default
                }
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (updatedCounties.length > 0 && ref.current && gRef.current) {
            const svg = d3.select<SVGSVGElement, unknown>(ref.current);
            const g = d3.select<SVGGElement, unknown>(gRef.current);

            // Define color scale AFTER bailMinMax is calculated
            const colorScale = d3.scaleLinear<string>().domain(bailMinMax).range(['blue', 'red']); // Or your desired color range

            const projection = d3.geoMercator().fitSize([width, height], {
                type: 'FeatureCollection',
                features: updatedCounties
            });
            const pathGenerator = d3.geoPath().projection(projection);

            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 8])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                });

            svg.call(zoom);

            g.selectAll('path')
                .data(updatedCounties, (d) => (d as CountyFeature).properties.geoid)
                .join('path')
                .attr('class', 'county')
                .attr('d', pathGenerator)
                .attr('fill', (d) => colorScale((d as CountyFeature).properties.average_bail_amount))
                .attr('stroke', 'rgba(55, 65, 81, 0.75)')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget)
                        .attr('stroke', 'white')
                        .raise();

                    const tooltip = d3.select(tooltipRef.current);
                    tooltip.style('left',
                        `${event.pageX + 10}px`)
                        .style('top', `${event.pageY + 10}px`)
                        .style('visibility', 'visible')
                        .style('background-color', colorScale((d as CountyFeature).properties.average_bail_amount))
                        .html(`
                         <div class="card fill-amber-600">
                            <h3 class="font-bold fill-amber-200">${(d as CountyFeature).properties.name} County</h3>
                            <p class="text-zinc-400">Average bail amount: 
                            <span class="font-bold text-white">
                              ${formatMoney((d as CountyFeature).properties.average_bail_amount as number)}
                              </span>
                             </p>
                            <p class="text-zinc-400">Number of cases: 
                                                        <span class="font-bold text-white">
${formatNumber((d as CountyFeature).properties.number_of_cases)}</span>
</p>
                        </div>
                            `);
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget).attr('stroke', 'rgba(55, 65, 81, 0.75)');

                    d3.select(tooltipRef.current).style('visibility', 'hidden');
                });
        }
    }, [width, height, bailMinMax, updatedCounties]);

    return (
        <>
            <svg ref={ref} width={width} height={height} style={{border: 'solid 1px white'}}>
                <g ref={gRef}></g>
            </svg>
            <div ref={tooltipRef} className="tooltip"></div>
        </>
    );
};

export default NewYorkCountiesMap;
