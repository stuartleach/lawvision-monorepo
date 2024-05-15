import { SigmaContainer } from "@react-sigma/core";
import {NetworkGraph} from "./NetworkGraph";
import {FC} from "react";


const App: FC = () => {
    return (
        <div>
            <h1>Graph of U.S. Supreme Court Cases</h1>
            <SigmaContainer style={{height: "100vh"}}>
            {/*<div style={{height: 100}}>*/}
                <NetworkGraph numCases={5}/>
            {/*</div>*/}
            </SigmaContainer>
        </div>
    );
};

export default App;
``
