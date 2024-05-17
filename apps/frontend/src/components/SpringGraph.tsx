import { useEffect } from "react";
import * as d3 from "d3";
import { useGraphData } from "../hooks/useGraphData"; // Adjust path if necessary
import { GraphData } from '../shared/types'; // Import shared types

interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
    label: string;
}

interface CustomEdge extends d3.SimulationLinkDatum<CustomNode> {
    source: CustomNode | string; // Use string if nodes are referenced by IDs
    target: CustomNode | string; // Use string if nodes are referenced by IDs
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
        if (isLoading) return; // Don't build the graph if data is still loading

        // Define your D3 graph logic here
        // This can be a different type of graph or layout

        const svg = d3.select("#spring-graph")
            .attr("width", width)
            .attr("height", height);

        // Clear previous graph
        svg.selectAll("*").remove();

        // Define nodes and edges
        const nodes: CustomNode[] = graphData.nodes.map(node => ({
            id: node.id,
            size: node.weight * 2,
            weight: node.weight,
            label: `${node.name} (${node.term})`
        }));

        const edges: CustomEdge[] = graphData.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            citation: edge.citation
        }));

        // Define force simulation
        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-50))
            .force("center", d3.forceCenter(width / 2, height / 2)) // Center the graph
            .force("link", d3.forceLink(edges).id((d: CustomNode) => d.id));

        // Add links
        const link = svg.append("g")
            .selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .attr("stroke-width", 1)
            .attr("stroke", "#999");

        // Add nodes
        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", d => d.size)
            .attr("fill", "blue");

        // Add labels
        const label = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("dy", -10)
            .text(d => d.label);

        simulation.on("tick", () => {
            node.attr("cx", d => d.x!)
                .attr("cy", d => d.y!);

            link.attr("x1", d => (d.source as CustomNode).x!)
                .attr("y1", d => (d.source as CustomNode).y!)
                .attr("x2", d => (d.target as CustomNode).x!)
                .attr("y2", d => (d.target as CustomNode).y!);

            label.attr("x", d => d.x!)
                .attr("y", d => d.y!);
        });

    }, [graphData, isLoading, numCases, width, height]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <svg id="spring-graph" className="w-full h-full"></svg>
        </div>
    );
};
