import { useEffect, useState } from "react";
import { getCases } from "../api"; // Adjust the path as necessary
import { GraphData } from "shared/src/types"; // Adjust the path as necessary

export const useGraphData = (numCases: number) => {
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getCases(numCases)
            .then((data: GraphData) => {
                // console.log("data: ", data);
                setGraphData(data);
            })
            .catch(e => console.error("Error fetching cases:", e))
            .finally(() => setIsLoading(false));
    }, [numCases]);

    return { graphData, isLoading };
};
