import { SigmaContainer } from "@react-sigma/core";
import {RadialNetworkGraph} from "./components/RadialNetworkGraph";
import {FC} from "react";
import ListOfCases from "./ListOfCases";
import {SpringGraph} from "./components/SpringGraph";


const App: FC = () => {
    return (
        <div>
            <h1 className={"w-full font-extrabold"}>Graph of U.S. Supreme Court Cases</h1>
            {/*<SigmaContainer style={{height: "100vh"}}>*/}
                {/*<RadialNetworkGraph  numCases={100}/>*/}
            {/*</SigmaContainer>*/}

            <div className="w-full h-96">
                <SpringGraph numCases={100} /></div>
            {/*<ListOfCases />*/}
        </div>
    );
};

export default App;
``
