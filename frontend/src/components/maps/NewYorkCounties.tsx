import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {Feature, Geometry} from 'geojson';
import {getData} from "../../api";

interface CountyProperties {

    countyName: string;
    countyUuid: string;
    numberOfCases: number;
    medianIncome: number;
    averageBailAmount: number;
    geoid: string;
    name: string;
    raceImportance: number; // Default race importance is 0

}

interface CountyFeature extends Feature<Geometry> {
    properties: CountyProperties;
}

const MapProps = {
    width: 960,
    height: 600
};

type ModelResults = {
    result_uuid: string;
    model_target_type: string;
    model_target: string;
    model_type: string;
    model_params?: object;
    average_bail_amount?: number;
    r_squared?: number;
    mean_squared_error?: number;
    gender_importance?: number;
    ethnicity_importance?: number;
    race_importance?: number;
    age_at_arrest_importance?: number;
    known_days_in_custody_importance?: number;
    top_charge_at_arraign_importance?: number;
    first_bail_set_cash_importance?: number;
    prior_vfo_cnt_importance?: number;
    prior_nonvfo_cnt_importance?: number;
    prior_misd_cnt_importance?: number;
    pend_nonvfo_importance?: number;
    pend_misd_importance?: number;
    pend_vfo_importance?: number;
    county_name_importance?: number;
    judge_name_importance?: number;
    median_household_income_importance?: number;
    time_elapsed?: number;
    created_at?: Date;
};

const NewYorkCountiesMap: React.FC<typeof MapProps> = ({width, height}) => {
    const ref = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [counties, setCounties] = useState<CountyFeature[]>([]);
    const [updatedCounties, setUpdatedCounties] = useState<CountyFeature[]>([]);
    const [bailMinMax, setBailMinMax] = useState<number[]>([0, 10000000]);

    useEffect(() => {
        fetch('/ny-counties.geojson')
            .then(response => response.json())
            .then(data => setCounties(data.features))
            .catch(console.error);
    }, []);

    useEffect(() => {
        const fetchModelResults = async () => {
            try {
                const countyResponse: ModelResults[] = await getData('counties') as ModelResults[];
                const updatedData = counties.map(county => {
                    const matchingResult = countyResponse.find(cos => cos.model_target === county.properties.name);
                    return {
                        ...county,
                        properties: {
                            ...county.properties,
                            averageBailAmount: matchingResult?.average_bail_amount ?? 0
                        }
                    };
                });
                setUpdatedCounties(updatedData);
            } catch (error) {
                console.error("Error fetching or updating counties:", error);
            }
        };

        const maxBailAmount = Math.max(...counties.map(c => c.properties.averageBailAmount));
        const minBailAmount = Math.min(...counties.map(c => c.properties.averageBailAmount));

        setBailMinMax([minBailAmount, maxBailAmount]);

        if (counties.length > 0) {
            fetchModelResults();
        }
    }, [counties]);

    useEffect(() => {
        if (updatedCounties.length > 0 && ref.current && gRef.current) {
            const svg = d3.select<SVGSVGElement, unknown>(ref.current);
            const g = d3.select<SVGGElement, unknown>(gRef.current);

            const colorScale = d3.scaleLinear<string>()
                .domain(bailMinMax)
                .range(['blue', 'red']);

            const projection = d3.geoMercator()
                .fitSize([width, height], {type: "FeatureCollection", features: updatedCounties});
            const pathGenerator = d3.geoPath().projection(projection);

            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 8])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                });

            svg.call(zoom);

            g.selectAll('path')
                .data(updatedCounties)
                .join('path')
                .attr('class', 'county')
                .attr('d', pathGenerator)
                .attr('fill', d => colorScale(d.properties.averageBailAmount))
                .attr('stroke', 'rgba(55, 65, 81, 0.75)')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget)
                        .attr('stroke', 'white')
                        .raise();

                    const tooltip = d3.select(tooltipRef.current);
                    tooltip.style('left', `${event.pageX + 10}px`)
                        .style('top', `${event.pageY + 10}px`)
                        .style('visibility', 'visible')
                        .style('background-color', 'rgba(55, 65, 81, 0.75)')
                        .html(`${d.properties.name} County`);
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget)
                        .attr('stroke', 'rgba(55, 65, 81, 0.75)');

                    d3.select(tooltipRef.current).style('visibility', 'hidden');
                });
        }
    }, [updatedCounties, width, height]);

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
