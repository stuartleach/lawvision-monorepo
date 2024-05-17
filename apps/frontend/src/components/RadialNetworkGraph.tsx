import {useLoadGraph} from "@react-sigma/core";
import {useEffect} from "react";
import * as gr from "graphology";
import * as d3 from "d3";
import {useGraphData} from "../hooks/useGraphData"; // Adjust path if necessary
import {GraphData} from '../shared/types'; // Import shared types

interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
    label: string;
}

interface RadialNetworkGraphProps {
    numCases: number;
    minNodeSize?: number;
    maxNodeSize?: number;
    baseNodeSize?: number;
    colorInterpolator?: (t: number) => string;
}

export const RadialNetworkGraph: React.FC<RadialNetworkGraphProps> = ({
                                                                          numCases,
                                                                          minNodeSize = 0.02,
                                                                          maxNodeSize = 55,
                                                                          baseNodeSize = 3,
                                                                          colorInterpolator = d3.interpolateRgb("blue", "red")
                                                                      }) => {
    const loadGraph = useLoadGraph();
    const {graphData, isLoading} = useGraphData(numCases);

    useEffect(() => {
        if (isLoading) return; // Don't build the graph if data is still loading

        const graph = new gr.MultiDirectedGraph();

        // Scale node size inversely with number of cases
        const scaledMinNodeSize = Math.max(minNodeSize, 100 / numCases);
        const scaledMaxNodeSize = Math.min(maxNodeSize, 500000 / numCases);

        // Find the maximum weight for normalization
        const maxWeight = Math.max(...graphData.nodes.map(node => node.weight));

        graphData.nodes.forEach(node => {
            const size = Math.min(Math.max(node.weight * baseNodeSize, scaledMinNodeSize), scaledMaxNodeSize); // Ensure size is within limits

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
                d => 300 - 550 * (d as CustomNode).size / scaledMaxNodeSize,  // Scale radius inversely with size
                400, 300).strength(1))  // Increased radial force strength
            .force("center", d3.forceCenter(400, 300));

        simulation.on("tick", () => {
            nodes.forEach(node => {
                graph.setNodeAttribute(node.id, 'x', node.x);
                graph.setNodeAttribute(node.id, 'y', node.y);
            });
            loadGraph(graph);
        });

    }, [loadGraph, graphData, isLoading, numCases, minNodeSize, maxNodeSize, baseNodeSize, colorInterpolator]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="relative w-full h-full">
                <div id="sigma-container" className="absolute inset-0"></div>
            </div>
        </div>
    );
};
