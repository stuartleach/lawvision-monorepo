import {useEffect, useState} from "react";
import {getData, targetData} from "../api"; // Adjust the path as necessary
import {GraphData, Judge} from "shared/src/types"; // Adjust the path as necessary


export const useGraphData = (target: targetData, targetNumber: number) => {
    const [graphData, setGraphData] = useState<GraphData>({nodes: [], edges: []});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getData("cases", targetNumber)
            .then((data: GraphData) => {
                console.log("data: ", data);
                setGraphData(data);
            })
            .catch(e => console.error("Error fetching cases:", e))
            .finally(() => setIsLoading(false));
    }, [targetNumber]);

    return {graphData, isLoading};
};


export const useJudgeData = (target: targetData, targetNumber: number) => {
    const [judgeData, setJudgeData] = useState<Judge[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getData("judges", targetNumber)
            .then((data: Judge[]) => {
                console.log("data: ", data);
                setJudgeData(data);
            })
            .catch(e => console.error("Error fetching judges:", e))
            .finally(() => setIsLoading(false));
    }, [targetNumber]);

    return {judgeData, isLoading};
}