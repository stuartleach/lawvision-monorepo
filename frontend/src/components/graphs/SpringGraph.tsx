import * as React from "react";
import {useEffect} from "react";
import * as d3 from "d3";
import {useGraphData} from "../../hooks/useGraphData";
import {CitationAndID} from "shared/src/types";

export interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
    name: string;
    year: string;
    citations: CitationAndID[];
}

interface CustomEdge extends d3.SimulationLinkDatum<CustomNode> {
    source: CustomNode | string;
    target: CustomNode | string;
    citation: CitationAndID;
}

interface SpringGraphProps {
    numCases: number;
    width?: number;
    height?: number;
    clickedNode?: CustomNode | null;
    setClickedNode: (node: CustomNode | null) => void;
}

export const SpringGraph: React.FC<SpringGraphProps> = ({numCases, width = 800, height = 600, setClickedNode}) => {
    const {graphData, isLoading} = useGraphData(numCases);


    useEffect(() => {
        if (isLoading) return;

        const svg = d3.select("#spring-graph")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("border", "1px solid black");

        svg.selectAll("*").remove();

        const g = svg.append("g");

        const nodes: CustomNode[] = graphData.nodes.map(node => {
            const nodeCitations = graphData.edges.filter(edge => edge.source === node.id).map(edge => ({
                citation: edge.citation.citation || "",
                id: edge.target as string
            }));

            return {
                id: node.id,
                size: node.weight * 1.1,
                weight: node.weight,
                name: node.name,
                year: node.term,
                citations: nodeCitations,
                x: width / 2,
                y: height / 2
            };
        });

        const edges: CustomEdge[] = graphData.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            citation: {
                citation: edge.citation.citation || "",
                id: edge.citation.id
            }
        }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).id((d: CustomNode) => d.id).distance(50).strength(1))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", () => {
                node.attr("cx", d => (d as CustomNode).x!)
                    .attr("cy", d => (d as CustomNode).y!);

                link.attr("x1", d => ((d.source as CustomNode).x!))
                    .attr("y1", d => ((d.source as CustomNode).y!))
                    .attr("x2", d => ((d.target as CustomNode).x!))
                    .attr("y2", d => ((d.target as CustomNode).y!));
            });

        const link = g.append("g")
            .selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke-width", 1)
            .attr("stroke", "#999");

        const node = g.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", d => (d as CustomNode).size)
            .attr("fill", d => d3.interpolateBlues((d as CustomNode).weight / 100))
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .call(d3.drag<SVGCircleElement, CustomNode>()
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
                console.log("Clicked node:", clickedNode);
                setClickedNode(clickedNode);

                // Reset all nodes and edges to their original state
                node.attr("opacity", 0.2).attr("fill", d => d3.interpolateBlues((d as CustomNode).weight / 100));
                link.attr("opacity", 0.2).attr("stroke", "#999");

                // Highlight the clicked node
                d3.select(event.currentTarget).attr("opacity", 1).attr("fill", "orange");

                // Highlight connected edges and nodes
                const connectedNodeIds = new Set<string>();

                // console.log("Nodes: ", nodes.filter(node => node.id === clickedNode));

                // console.log("Edges: ", edges.filter(edge => edge.source === clickedNode.id || edge.target === clickedNode.id));
                console.log("Edges: ", edges.filter(edge => clickedNode.name === edge.source.name || clickedNode.name === edge.target.name));
                // console.log("Clicked node ID: ", clickedNode.id);

                edges.forEach(edge => {
                    if (edge.source.name === clickedNode.name || edge.target.name === clickedNode.name) {
                        // console.log("Connected edge:", edge);
                        d3.selectAll<SVGLineElement, CustomEdge>(".link")
                            .filter(d => (d.source === edge.source && d.target === edge.target) || (d.source === edge.target && d.target === edge.source))
                            .attr("opacity", 1)
                            .attr("stroke", "orange");
                        d3.select(event.currentTarget).attr("opacity", 1).attr("fill", "orange");
                        d3.selectAll(".node").filter(d => (d.name === (edge.source.name || d.name === edge.target.name)) && (d.name !== clickedNode.name)).attr("opacity", .8).attr("fill", "orange")


                        connectedNodeIds.add(edge.source as string);
                        connectedNodeIds.add(edge.target as string);
                    }
                });
                console.log("Connected nodes: ", connectedNodeIds);


                connectedNodeIds.forEach(nodeId => {
                    d3.selectAll<SVGCircleElement, CustomNode>(".node")
                        .filter(d => (d as CustomNode).id === nodeId)
                        .attr("opacity", 1)
                        .attr("fill", "orange");
                });
            });

        node.append("title")
            .text(d => `Case: ${d.name} (${d.year})\nCited by: ${(d as CustomNode).weight} cases\nCites: ${(d as CustomNode).citations.length} cases\n`);

        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on("zoom", ({transform}) => {
                g.attr("transform", transform);
            });

        svg.call(zoom);

    }, [graphData, isLoading, numCases, width, height]);

    return (
        <div className="justify-center items-center w-full h-full">
            <svg id="spring-graph" className="w-full h-full border-amber-300 border-8"></svg>
        </div>
    );
};
