import {FC, useEffect} from "react";
// import Header, {TopBar} from "./components/Header";
import type {CustomNode} from "./components/graphs/CaseSpringGraph";
import "./App.css";
import * as THREE from "three";
import ScatterPlot from "./components/graphs/ScatterPlot";
import NewYorkCountiesMap from "./components/maps/NewYorkCounties";

interface InfoProps {
    clickedNode: CustomNode | null;
}

const Info: FC<InfoProps> = ({clickedNode}) => {
    useEffect(() => {
        if (clickedNode) {
            console.log(clickedNode);
            console.log(clickedNode.citations[0]);
        }
    }, [clickedNode]);

    return (
        <div className="info-container mb-5 font-mono">
            <h1 className="text-2xl font-extrabold font-mono">Case Information</h1>
            {clickedNode ? (
                <div>
                    <h2 className="text-xl">{clickedNode.name}</h2>
                    <p>Year: {clickedNode.year}</p>
                    <p>Weight: {clickedNode.weight}</p>
                    {clickedNode.citations.length > 0 ? (
                        <p>Citations: {clickedNode.citations.map(c => c.citation).join(", ")}</p>
                    ) : (
                        <p>No citations</p>
                    )}
                </div>
            ) : (
                <p>No case selected</p>
            )}
        </div>
    );
};

const App: FC = () => {
    // const [numCases, setNumCases] = useState<number>(10);
    // const [clickedNode, setClickedNode] = useState<CustomNode | null>(null);

    return (
        <div className="app-container">
            {(
                <NewYorkCountiesMap height={1200} width={1200}/>
            )}
        </div>
    );
};

export default App;
