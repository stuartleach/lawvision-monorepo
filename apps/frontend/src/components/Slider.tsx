import * as React from 'react';

interface SliderProps {
    numCases: number;
    setNumCases: React.Dispatch<React.SetStateAction<number>>;
}

export const Slider: React.FC<SliderProps> = ({ numCases, setNumCases }) => {
    const [sliderValue, setSliderValue] = React.useState(numCases);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderValue(parseInt(e.target.value));
        debounce(() => setNumCases(parseInt(e.target.value)), 1000)();
    }

    const debounce = (func: () => void, wait: number) => {
        let timeout: number;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    return (
        <div>
            <label htmlFor="num-cases-slider" className="font-mono text-orange-500 block mb-2 text-sm font-bold">Number of Cases to Fetch</label>
            <input
                id="num-cases-slider"
                type="range"
                min="0"
                max="1000"
                value={sliderValue}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );
}
