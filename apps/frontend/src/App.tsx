import { FC } from "react";
import { SpringGraph } from "./components/SpringGraph";

const App: FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <SpringGraph numCases={1000} />
        </div>
    );
};

export default App;
