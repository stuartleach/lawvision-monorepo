import { useEffect } from "react";
import * as d3 from "d3";
import { useGraphData } from "../../hooks/useGraphData";
import { GraphData } from '../shared/types';

interface CustomNode {
    id: string;
    parentId: string | null;
    name: string;
    weight: number;
    term: string;
}

interface HierarchicalGraphProps {
    numCases: number;
    width?: number;
    height?: number;
}

export const HierarchicalGraph: React.FC<HierarchicalGraphProps> = ({ numCases, width = 800, height = 600 }) => {
    const { graphData, isLoading } = useGraphData(numCases);

    useEffect(() => {
        if (isLoading) return;

        const svg = d3.select("#hierarchical-graph")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("border", "1px solid black");

        svg.selectAll("*").remove();

        const g = svg.append("g");

        // Create a map of node IDs to their parent IDs
        const nodeMap = new Map(graphData.edges.map(edge => [edge.target, edge.source]));

        // Create an array of nodes with their respective parent IDs
        const nodes: CustomNode[] = graphData.nodes.map(node => ({
            id: node.id,
            parentId: nodeMap.get(node.id) || null,
            name: node.name,
            weight: node.weight,
            term: node.term,
        }));

        // Detect and remove cycles
        const visited = new Set<string>();
        const stack = new Set<string>();

        function visit(nodeId: string): boolean {
            if (stack.has(nodeId)) return false;
            if (visited.has(nodeId)) return true;

            stack.add(nodeId);
            const parentId = nodeMap.get(nodeId);
            if (parentId && !visit(parentId)) return false;

            stack.delete(nodeId);
            visited.add(nodeId);
            return true;
        }

        for (const node of nodes) {
            if (!visit(node.id)) {
                console.warn(`Cycle detected at node ${node.id}, removing edge to ${nodeMap.get(node.id)}`);
                nodeMap.delete(node.id);
            }
        }

        // Create a map without cycles
        const nodeMapWithoutCycles = new Map<string, string | null>();
        nodes.forEach(node => {
            nodeMapWithoutCycles.set(node.id, nodeMap.get(node.id) || null);
        });

        // Ensure a single root node
        const rootId = nodes.find(node => !nodeMapWithoutCycles.get(node.id))?.id;
        if (!rootId) {
            console.error("No root node found");
            return;
        }

        const rootNodes = nodes.filter(node => !node.parentId);
        if (rootNodes.length > 1) {
            rootNodes.forEach(node => {
                if (node.id !== rootId) {
                    node.parentId = rootId;
                }
            });
        }

        // Create a stratified root
        const root = d3.stratify<CustomNode>()
            .id(d => d.id)
            .parentId(d => d.parentId)(nodes);

        // Create a tree layout
        const treeLayout = d3.tree<CustomNode>().size([height, width]);
        const treeData = treeLayout(root);

        // Create links
        const link = g.selectAll(".link")
            .data(treeData.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", d3.linkHorizontal<HierarchyPointLink<CustomNode>, HierarchyPointNode<CustomNode>>()
                .x(d => d.y)
                .y(d => d.x))
            .attr("stroke", "#999")
            .attr("fill", "none");

        // Create nodes
        const node = g.selectAll(".node")
            .data(treeData.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`);

        node.append("circle")
            .attr("r", 5)
            .attr("fill", "blue");

        node.append("text")
            .attr("dy", ".35em")
            .attr("x", d => d.children ? -10 : 10)
            .attr("text-anchor", d => d.children ? "end" : "start")
            .text(d => `${d.data.name} (${d.data.term})`);

        node.append("title")
            .text(d => `Case: ${d.data.name}\nYear: ${d.data.term}\nCites: ${graphData.edges.filter(edge => edge.source === d.data.id).length} cases`);

        // Define zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on("zoom", ({ transform }) => {
                g.attr("transform", transform);
            });

        svg.call(zoom);

    }, [graphData, isLoading, numCases, width, height]);

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <svg id="hierarchical-graph" className="w-full h-full"></svg>
        </div>
    );
};
