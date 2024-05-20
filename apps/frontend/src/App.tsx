import {useState, FC, useEffect} from "react";
import Header from "./components/Header";
import {Slider} from "./components/Slider";
import {SpringGraph} from "./components/graphs/SpringGraph";
import type {CustomNode} from "./components/graphs/SpringGraph";
import "./assets/lv_logo_1.svg"; // Tell webpack to include the logo in the bundle

// import svg as component
import Logo from "./assets/lv_logo_1.svg";

const Info = ({clickedNode}) => {
    useEffect(() => {
        if (clickedNode) {
            console.log(clickedNode);
        }
        console.log(clickedNode?.citations[0])
    }, [clickedNode]);

    return (
        <div className="mb-5 font-mono">
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

function TopBar() {


    return (<div className={"justify-center content-center w-full flex "}>
        <img src={Logo} className={"justify-center h-60 align-middle p-10"}/>
    </div>)
}

const App: FC = () => {
    const [numCases, setNumCases] = useState<number>(10);
    const [clickedNode, setClickedNode] = useState(null as CustomNode | null);

    return (
        <div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100vh",
                    width: "100vw",
                    justifyContent: "center",
                }}>


                <div style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "rgba(55, 65, 81, 0.25)",
                    color: "white",
                    borderRadius: "12px"
                }}>
                    <Header/>
                    <Slider numCases={numCases} setNumCases={setNumCases}/>
                </div>
                <div style={{flex: 1.5, display: "flex", flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
                    <div className={""}>
                        <TopBar/>
                    </div>
                    <SpringGraph clickedNode={clickedNode} setClickedNode={setClickedNode} numCases={numCases}/>
                </div>
                <div style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "rgba(55, 65, 81, 0.25)",
                    color: "white",
                    borderRadius: "12px"
                }}>
                    <Info clickedNode={clickedNode}/>
                </div>
            </div>
        </div>
    );
};

export default App;
