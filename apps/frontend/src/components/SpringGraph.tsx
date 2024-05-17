import { useEffect } from "react";
import * as d3 from "d3";
import { useGraphData } from "../hooks/useGraphData"; // Adjust path if necessary
import { GraphData } from '../shared/types'; // Import shared types

interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
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

        const svg = d3.select("#spring-graph")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet") // Ensure SVG scales properly
            .style("border", "1px solid black"); // Add border for debugging

        // Clear previous graph
        svg.selectAll("*").remove();

        const g = svg.append("g"); // Group for zooming and panning

        // Define nodes and edges
        const nodes: CustomNode[] = graphData.nodes.map(node => ({
            id: node.id,
            size: node.weight * 2,
            weight: node.weight,
            x: width / 2, // Start nodes in the center
            y: height / 2 // Start nodes in the center
        }));

        const edges: CustomEdge[] = graphData.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            citation: edge.citation
        }));

        // Define force simulation
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).id((d: CustomNode) => d.id).distance(50).strength(1))
            .force("charge", d3.forceManyBody().strength(-200)) // Adjust repulsion to keep nodes within bounds
            .force("center", d3.forceCenter(width / 2, height / 2)) // Center the graph
            .on("tick", () => {
                node.attr("cx", d => d.x!)
                    .attr("cy", d => d.y!);

                link.attr("x1", d => (d.source as CustomNode).x!)
                    .attr("y1", d => (d.source as CustomNode).y!)
                    .attr("x2", d => (d.target as CustomNode).x!)
                    .attr("y2", d => (d.target as CustomNode).y!);
            });

        // Add links
        const link = g.append("g")
            .selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .attr("stroke-width", 1)
            .attr("stroke", "#999");

        // Add nodes
        const node = g.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", d => d.size)
            .attr("fill", "blue");

        // Define zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10]) // Set zoom limits
            .on("zoom", ({ transform }) => {
                g.attr("transform", transform);
            });

        svg.call(zoom);

        // Calculate the bounding box of the graph
        simulation.on("end", () => {
            const bounds = svg.node().getBBox();
            const fullWidth = bounds.width;
            const fullHeight = bounds.height;

            const midX = bounds.x + fullWidth / 2;
            const midY = bounds.y + fullHeight / 2;

            const scale = 0.9 / Math.max(fullWidth / width, fullHeight / height);
            const transform = d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(scale)
                .translate(-midX, -midY);

            svg.transition()
                .duration(750)
                .call(zoom.transform, transform);
        });

    }, [graphData, isLoading, numCases, width, height]);

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <svg id="spring-graph" className="w-full h-full"></svg>
        </div>
    );
};
