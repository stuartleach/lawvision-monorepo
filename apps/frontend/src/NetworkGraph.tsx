import {useLoadGraph} from "@react-sigma/core";
import {useEffect, useState} from "react";
import * as gr from "graphology";
import * as d3 from "d3";
import {getCases} from "./api";
import {SupremeCourtCase} from "@shared/prisma";

interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    size: number;
    weight: number;
    label: string;
}


export const NetworkGraph = (props: { numCases: number }) => {
    const loadGraph = useLoadGraph();
    const [courtCases, setCourtCases] = useState<SupremeCourtCase[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true); // Start loading

        getCases(props.numCases)
            .then(setCourtCases)
            .catch(e => console.error("Error fetching cases:", e))
            .finally(() => setIsLoading(false)); // Done loading

    }, [props.numCases]);

    useEffect(() => {
        if (isLoading) return; // Don't build the graph if data is still loading

        const graph = new gr.MultiDirectedGraph();

        console.log(courtCases)

        courtCases.forEach(caseItem => {
            // const children = caseItem.childCases.length
            // console.log(caseItem.citations.length)
            const children = caseItem.name.length
            const weight = 2 ** children
            graph.addNode(caseItem.name, {
                size: weight * 1.5,
                strength: weight,
                color: `rgb(142, 11, 119, ${Math.min(1, 0.1 + children / 5)})`,
                x: Math.random(),
                y: Math.random(),
                label: caseItem.title
            });
        });

        courtCases.forEach(caseItem => {
            caseItem.citations.forEach((citation: unknown) => {
                if (graph.hasNode(citation)) {
                    graph.addEdge(caseItem.caseCitation, citation, {
                        type: 'arrow',
                        size: 0.05,
                        color: `rgb(142, 11, 119, 0.1)`,
                    });
                }
            });
        });

        loadGraph(graph);

        const nodes: CustomNode[] = graph.nodes().map(node => ({
            id: node,
            x: graph.getNodeAttribute(node, 'x'),
            y: graph.getNodeAttribute(node, 'y'),
            size: graph.getNodeAttribute(node, 'size'),
            weight: graph.inDegree(node),
            label: graph.getNodeAttribute(node, 'label')
        }));

        /*   const links = graph.edges().map(edge => ({
               source: graph.source(edge),
               target: graph.target(edge)
           }));*/

        const simulation = d3.forceSimulation(nodes)
            // .force("link", d3.forceLink(links).id(d => (d as CustomNode).id).strength(.9))
            .force("collide", d3.forceCollide().radius(d => (d as CustomNode).size * -1).strength(0.5))
            .force("charge", d3.forceManyBody().strength(d => -400 * (d as CustomNode).size))  // Increased repulsion for larger nodes
            .force("radial", d3.forceRadial(
                d => 300 - 10 * (d as CustomNode).size,  // Inversely scale radius based on size
                400, 300).strength(0.8))  // Increased radial force strength
            .force("center", d3.forceCenter(400, 300));

        simulation.on("tick", () => {
            nodes.forEach(node => {
                graph.setNodeAttribute(node.id, 'x', node.x);
                graph.setNodeAttribute(node.id, 'y', node.y);

            });
            loadGraph(graph);
        });


    }, [loadGraph, props.numCases, courtCases, isLoading]);

    return null;
};