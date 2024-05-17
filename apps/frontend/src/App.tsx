import { useState, FC } from "react";
import Header from "./components/Header";
import { Slider } from "./components/Slider";
import { SpringGraph } from "./components/graphs/SpringGraph";

const App: FC = () => {
    const [numCases, setNumCases] = useState<number>(100);

    return (
        <div className="flex h-screen">
            <div className="w-1/5 p-10 bg-gray-900 bg-opacity-25 text-white rounded-2xl fixed z-10 mt-16 ml-16">
                <Header />
                <Slider numCases={numCases} setNumCases={setNumCases} />
            </div>
            <div className="ml-1/3 w-full">
                <SpringGraph numCases={numCases} />
            </div>
        </div>
    );
};

export default App;
