import { useLoadGraph } from "@react-sigma/core";
import { useEffect, useState } from "react";
import * as gr from "graphology";
import * as d3 from "d3";
import { getCases } from "./api";
import { GraphData } from './shared/types'; // Import shared types

interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
    label: string;
}

export const NetworkGraph = (props: { numCases: number }) => {
    const loadGraph = useLoadGraph();
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true); // Start loading

        getCases(props.numCases)
            .then(setGraphData)
            .catch(e => console.error("Error fetching cases:", e))
            .finally(() => setIsLoading(false)); // Done loading

    }, [props.numCases]);

    useEffect(() => {
        if (isLoading) return; // Don't build the graph if data is still loading

        const graph = new gr.MultiDirectedGraph();

        // Define node size limits to avoid excessively large nodes
        const minNodeSize = Math.max(0.02, 100 / props.numCases); // Scale minimum node size inversely with number of cases
        const maxNodeSize = Math.min(55, 500000 / props.numCases); // Scale maximum node size inversely with number of cases

        // Define color interpolation between blue and red
        const colorInterpolator = d3.interpolateRgb("blue", "red");

        // Find the maximum weight for normalization
        const maxWeight = Math.max(...graphData.nodes.map(node => node.weight));

        graphData.nodes.forEach(node => {
            const size = Math.min(Math.max(node.weight * 3, minNodeSize), maxNodeSize); // Ensure size is within limits

            // Calculate color intensity based on weight
            const normalizedWeight = node.weight / maxWeight; // Normalize weight to range [0, 1]
            const color = colorInterpolator(normalizedWeight); // Interpolate color

            graph.addNode(node.id, {
                size,
                weight: node.weight,
                color,
                x: Math.random(),
                y: Math.random(),
                label: `${node.name} (${node.term})\nCited by ${node.weight} cases\nCites ${graphData.edges.filter(edge => edge.source === node.id).length} cases`,
            });
        });

        graphData.edges.forEach(edge => {
            if (edge.target && graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
                graph.addEdge(edge.source, edge.target, {
                    type: 'arrow',
                    size: 1,
                    color: `rgb(142, 15, 119, 0.3)`,
                });
            }
        });

        // Log the citations for each case
        graphData.nodes.forEach(node => {
            const outgoingEdges = graph.outboundEdges(node.id);
            console.log(`Case ${node.name} cites:`);
            outgoingEdges.forEach(edge => {
                const targetNode = graph.target(edge);
                console.log(` - ${graph.getNodeAttribute(targetNode, 'label')}`);
            });
        });

        loadGraph(graph);

        const nodes: CustomNode[] = graph.nodes().map(node => ({
            id: node,
            x: graph.getNodeAttribute(node, 'x'),
            y: graph.getNodeAttribute(node, 'y'),
            size: graph.getNodeAttribute(node, 'size'),
            weight: graph.getNodeAttribute(node, 'weight'),
            label: graph.getNodeAttribute(node, 'label')
        }));

        const simulation = d3.forceSimulation(nodes)
            .force("collide", d3.forceCollide().radius(d => (d as CustomNode).size * 2).strength(0.7)) // Increase collision radius and strength
            .force("charge", d3.forceManyBody().strength(d => -2000 * (d as CustomNode).size))  // Increased repulsion for larger nodes
            .force("radial", d3.forceRadial(
                d => 300 - 550 * (d as CustomNode).size / maxNodeSize,  // Scale radius inversely with size
                400, 300).strength(1))  // Increased radial force strength
            .force("center", d3.forceCenter(400, 300));

        simulation.on("tick", () => {
            nodes.forEach(node => {
                graph.setNodeAttribute(node.id, 'x', node.x);
                graph.setNodeAttribute(node.id, 'y', node.y);
            });
            loadGraph(graph);
        });

    }, [loadGraph, graphData, isLoading, props.numCases]);

    return null;
};
