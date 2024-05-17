import { useEffect } from "react";
import * as d3 from "d3";
import { useGraphData } from "../../hooks/useGraphData"; // Adjust path if necessary
import { GraphData } from '../../shared/types'; // Import shared types

interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
    name: string;
    year: string;
    citations: string[];
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
            size: node.weight * 1.1,
            weight: node.weight,
            name: node.name,
            year: node.term,
            citations: graphData.edges.filter(edge => edge.source === node.id).map(edge => edge.citation),
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

                adjustZoom();
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
            .attr("fill", d => d3.interpolateBlues(d.weight / 100)) // Use color scale for nodes
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .call(d3.drag() // Add drag behavior
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
                }));

        // Add tooltips
        node.append("title")
            .text(d => `Case: ${d.name} (${d.year})\nCited by: ${d.weight} cases\nCites: ${d.citations.length} cases\n`);

        // Define zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10]) // Set zoom limits
            .on("zoom", ({ transform }) => {
                g.attr("transform", transform);
            });

        svg.call(zoom);

        const adjustZoom = () => {
            const bounds = g.node()!.getBBox(); // Use getBBox on the group
            const fullWidth = bounds.width;
            const fullHeight = bounds.height;

            const midX = bounds.x + fullWidth / 2;
            const midY = bounds.y + fullHeight / 2;

            const scale = 0.9 / Math.max(fullWidth / width, fullHeight / height);
            const transform = d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(scale)
                .translate(-midX, -midY);

            svg.transition().duration(750).call(zoom.transform, transform);
        };


    }, [graphData, isLoading, numCases, width, height]);

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <svg id="spring-graph" className="w-full h-full"></svg>
        </div>
    );
};
