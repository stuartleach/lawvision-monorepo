// packages/shared/types.ts
export interface SupremeCourtCase {
    caseCitation: string;
    title: string;
    citations: string[];
    childCases: SupremeCourtCase[];
}

export interface Node {
    id: string;
    name: string;
    term: string;
    weight: number;
}

export interface Edge {
    source: string;
    target: string | null;
    citation: CitationAndID;
}

export interface CitationAndID {
    citation: string;
    id: string;
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

export interface Judge {
    id: string;
    name: string;
    average_bail_set: string;
    ror_count: number;
    case_count: number;
}