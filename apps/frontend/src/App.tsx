import { SigmaContainer } from "@react-sigma/core";
import {NetworkGraph} from "./NetworkGraph";
import {FC} from "react";
import ListOfCases from "./ListOfCases";


const App: FC = () => {
    return (
        <div>
            <h1>Graph of U.S. Supreme Court Cases</h1>
            <SigmaContainer style={{height: "100vh"}}>
                <NetworkGraph numCases={5}/>
            </SigmaContainer>
            <ListOfCases />
        </div>
    );
};

export default App;
``
