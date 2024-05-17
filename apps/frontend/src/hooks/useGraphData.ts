import { useEffect, useState } from "react";
import { getCases } from "../api";
import { GraphData } from './shared/types';

export const useGraphData = (numCases: number) => {
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true); // Start loading

        getCases(numCases)
            .then(setGraphData)
            .catch(e => console.error("Error fetching cases:", e))
            .finally(() => setIsLoading(false)); // Done loading

    }, [numCases]);

    return { graphData, isLoading };
};
