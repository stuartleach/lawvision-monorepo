import { useState, FC } from "react";
import { SigmaContainer } from "@react-sigma/core";
import { RadialNetworkGraph } from "./components/graphs/RadialNetworkGraph";
import { SpringGraph } from "./components/graphs/SpringGraph";
import { HierarchicalGraph } from "./components/graphs/HierarchicalGraph";

enum GraphType {
    Radial,
    Spring,
    Hierarchical
}

const App: FC = () => {
    const [graphType, setGraphType] = useState<GraphType>(GraphType.Hierarchical);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="mb-4">
                <button
                    className="px-4 py-2 m-2 bg-blue-500 text-white rounded"
                    onClick={() => setGraphType(GraphType.Hierarchical)}
                >
                    Hierarchical Graph
                </button>
                <button
                    className="px-4 py-2 m-2 bg-green-500 text-white rounded"
                    onClick={() => setGraphType(GraphType.Spring)}
                >
                    Spring Graph
                </button>
                {/*<button*/}
                {/*    className="px-4 py-2 m-2 bg-red-500 text-white rounded"*/}
                {/*    onClick={() => setGraphType(GraphType.Radial)}*/}
                {/*>*/}
                {/*    Radial Network Graph*/}
                {/*</button>*/}
            </div>
            {graphType === GraphType.Hierarchical && <HierarchicalGraph numCases={100} />}
            {graphType === GraphType.Spring && <SpringGraph numCases={1000} />}
            {/*{graphType === GraphType.Radial && (*/}
            {/*    <SigmaContainer style={{ height: "100vh", width: "100vw" }}>*/}
            {/*        <RadialNetworkGraph numCases={100} />*/}
            {/*    </SigmaContainer>*/}
            {/*)}*/}
            {/* Optionally, include ListOfCases or other components */}
            {/* <ListOfCases /> */}
        </div>
    );
};

export default App;
