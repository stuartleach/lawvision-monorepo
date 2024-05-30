import { useState, FC, useEffect } from "react";
import Header, { TopBar } from "./components/Header";
import { Slider } from "./components/Slider";
import { CaseSpringGraph } from "./components/graphs/CaseSpringGraph";
import type { CustomNode } from "./components/graphs/CaseSpringGraph";
import "./App.css";
import Molecule from "./components/3d/Box"; // Import CSS for styling;
import * as THREE from "three";
import ScatterPlot from "./components/graphs/ScatterPlot";
import NewYorkCountiesMap from "./components/maps/NewYorkCounties";

interface InfoProps {
    clickedNode: CustomNode | null;
}

const Info: FC<InfoProps> = ({ clickedNode }) => {
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
    const [numCases, setNumCases] = useState<number>(10);
    const [clickedNode, setClickedNode] = useState<CustomNode | null>(null);

    return (
        <div className="app-container">
            {true && (
                <NewYorkCountiesMap height={1200} width={1200} />
            )}
            {false && (
                <>
                    <div className="sidebar">
                        <div className="sidebar-content">
                            <Header />
                            <Slider numCases={numCases} setNumCases={setNumCases} />
                        </div>
                        <TopBar />
                    </div>
                    <div className="main-content">
                        {/* <CaseSpringGraph
                            clickedNode={clickedNode}
                            setClickedNode={setClickedNode}
                            targetNumber={numCases}
                        /> */}
                    </div>
                    <div className="sidebar">
                        <Info clickedNode={clickedNode} />
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
