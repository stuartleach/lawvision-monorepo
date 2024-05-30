import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Feature, Geometry } from 'geojson';

interface CountyProperties {
    geoid: string;
    name: string;
}

interface CountyFeature extends Feature<Geometry> {
    properties: CountyProperties;
}

const MapProps = {
    width: 960,
    height: 600
};

const NewYorkCountiesMap: React.FC<typeof MapProps> = ({ width, height }) => {
    const ref = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [counties, setCounties] = useState<CountyFeature[]>([]);

    useEffect(() => {
        fetch('/ny-counties.geojson')
            .then(response => response.json())
            .then(data => setCounties(data.features))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (counties.length > 0 && ref.current && gRef.current) {
            const svg = d3.select<SVGSVGElement, unknown>(ref.current);
            const g = d3.select<SVGGElement, unknown>(gRef.current);

            const projection = d3.geoMercator()
                .fitSize([width, height], { type: "FeatureCollection", features: counties });
            const pathGenerator = d3.geoPath().projection(projection);

            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 8])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                });

            svg.call(zoom);

            g.selectAll('path')
                .data(counties)
                .join('path')
                .attr('class', 'county')
                .attr('d', pathGenerator)
                .attr('fill', '#ccc')
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
    }, [counties, width, height]);

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
