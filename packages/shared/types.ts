type SupremeCourtCase = {
    caseCitation: string;
    title: string;
    citations: string[];
    childCases: SupremeCourtCase[];
};

interface Node {
    id: string;
    name: string;
    term: string;
    weight: number;
}

interface Edge {
    source: string;
    target: string | null;
    citation: string;
}

interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

export {Node, Edge, GraphData, SupremeCourtCase};