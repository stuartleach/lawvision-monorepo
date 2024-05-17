import { useEffect, useState } from "react";
import * as d3 from "d3";
import { useGraphData } from "../../hooks/useGraphData"; // Adjust path if necessary
import { GraphData } from '../shared/types'; // Import shared types

interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
    name: string;
    year: string;
    citations: string[];
    fx?: number | null; // Fixed x-position
    fy?: number | null; // Fixed y-position
    x?: number; // Current x-position
    y?: number; // Current y-position
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
    const [highlightedNode, setHighlightedNode] = useState<CustomNode | null>(null);

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
        const simulation = d3.forceSimulation<CustomNode>(nodes)
            .force("link", d3.forceLink<CustomNode, CustomEdge>(edges).id(d => d.id).distance(50).strength(1))
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
            .on("click", (event, d) => {
                setHighlightedNode(d);
            })
            .call(d3.drag<SVGCircleElement, CustomNode>() // Add drag behavior
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

            if (!bounds.width || !bounds.height) {
                console.warn('Invalid bounds:', bounds);
                return;
            }

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

    useEffect(() => {
        const svg = d3.select("#spring-graph");
        const g = svg.select("g");
        const node = g.selectAll("circle");
        const link = g.selectAll("line");

        // Update node and link colors based on highlighted node
        if (highlightedNode) {
            const connectedNodes = new Set<string>();
            const connectedEdges = new Set<string>();

            // Collect connected nodes and edges
            link.each(d => {
                if (d.source === highlightedNode.id) {
                    connectedNodes.add(d.target as string);
                    connectedEdges.add(`${d.source}-${d.target}`);
                } else if (d.target === highlightedNode.id) {
                    connectedNodes.add(d.source as string);
                    connectedEdges.add(`${d.source}-${d.target}`);
                }
            });

            node.attr("fill", d => {
                if (d.id === highlightedNode.id) return "red";
                if (connectedNodes.has(d.id)) return "orange";
                return d3.interpolateBlues(d.weight / 100);
            })
                .attr("stroke", d => (d.id === highlightedNode.id || connectedNodes.has(d.id)) ? "yellow" : "#000")
                .attr("stroke-width", d => (d.id === highlightedNode.id || connectedNodes.has(d.id)) ? 2 : 0.5);

            link.attr("stroke", d => {
                if (connectedEdges.has(`${d.source}-${d.target}`)) return "red";
                return "#999";
            })
                .attr("stroke-width", d => (connectedEdges.has(`${d.source}-${d.target}`)) ? 2 : 1);

            // Remove existing text labels
            g.selectAll("text").remove();

            // Add text label for highlighted node
            g.append("text")
                .attr("x", highlightedNode.x! + 10)
                .attr("y", highlightedNode.y!)
                .text(highlightedNode.name)
                .attr("fill", "black")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");

            // Add text labels for connected nodes
            node.filter(d => connectedNodes.has(d.id))
                .each(d => {
                    g.append("text")
                        .attr("x", d.x! + 10)
                        .attr("y", d.y!)
                        .text(d.name)
                        .attr("fill", "black")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold");
                });
        } else {
            node.attr("fill", d => d3.interpolateBlues(d.weight / 100))
                .attr("stroke", "#000")
                .attr("stroke-width", 0.5);

            link.attr("stroke", "#999")
                .attr("stroke-width", 1);

            g.selectAll("text").remove(); // Remove text labels
        }
    }, [highlightedNode]);

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <svg id="spring-graph" className="w-full h-full"></svg>
        </div>
    );
};
