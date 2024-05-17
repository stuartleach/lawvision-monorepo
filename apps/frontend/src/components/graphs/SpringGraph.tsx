import { useEffect, useState } from "react";
import * as d3 from "d3";
import { useGraphData } from "../../hooks/useGraphData";
import { GraphData } from "../../shared/types";

interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
    name: string;
    year: string;
    citations: string[];
}

interface CustomEdge extends d3.SimulationLinkDatum<CustomNode> {
    source: CustomNode | string;
    target: CustomNode | string;
    citation: string;
}

interface SpringGraphProps {
    numCases: number;
    width?: number;
    height?: number;
}

export const SpringGraph: React.FC<SpringGraphProps> = ({ numCases, width = 800, height = 600 }) => {
    const { graphData, isLoading } = useGraphData(numCases);

    useEffect(() => {
        if (isLoading) return;

        const svg = d3.select("#spring-graph")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("border", "1px solid black");

        svg.selectAll("*").remove();

        const g = svg.append("g");

        const nodes: CustomNode[] = graphData.nodes.map(node => ({
            id: node.id,
            size: node.weight * 1.1,
            weight: node.weight,
            name: node.name,
            year: node.term,
            citations: graphData.edges.filter(edge => edge.source === node.id).map(edge => edge.citation),
            x: width / 2,
            y: height / 2
        }));

        const edges: CustomEdge[] = graphData.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            citation: edge.citation
        }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).id((d: CustomNode) => d.id).distance(50).strength(1))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", () => {
                node.attr("cx", d => d.x!)
                    .attr("cy", d => d.y!);

                link.attr("x1", d => (d.source as CustomNode).x!)
                    .attr("y1", d => (d.source as CustomNode).y!)
                    .attr("x2", d => (d.target as CustomNode).x!)
                    .attr("y2", d => (d.target as CustomNode).y!);
            });

        const link = g.append("g")
            .selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .attr("stroke-width", 1)
            .attr("stroke", "#999");

        const node = g.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", d => d.size)
            .attr("fill", d => d3.interpolateBlues(d.weight / 100))
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .call(d3.drag()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }))
            .on("click", (event, clickedNode) => {
                // Reset all nodes and edges to their original color
                node.attr("fill", d => d3.interpolateBlues(d.weight / 100));
                link.attr("stroke", "#999");

                // Highlight the clicked node
                d3.select(event.currentTarget).attr("fill", "orange");

                // Highlight connected edges and nodes
                const connectedEdges = edges.filter(edge => edge.source === clickedNode.id || edge.target === clickedNode.id);
                connectedEdges.forEach(edge => {
                    d3.selectAll("line")
                        .filter(d => d === edge)
                        .attr("stroke", "orange");

                    // Highlight connected nodes
                    const sourceNode = nodes.find(node => node.id === edge.source);
                    const targetNode = nodes.find(node => node.id === edge.target);
                    d3.selectAll("circle")
                        .filter(d => d === sourceNode || d === targetNode)
                        .attr("fill", "orange");
                });
            });

        node.append("title")
            .text(d => `Case: ${d.name} (${d.year})\nCited by: ${d.weight} cases\nCites: ${d.citations.length} cases\n`);

        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on("zoom", ({ transform }) => {
                g.attr("transform", transform);
            });

        svg.call(zoom);

    }, [graphData, isLoading, numCases, width, height]);

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <svg id="spring-graph" className="w-full h-full"></svg>
        </div>
    );
};
