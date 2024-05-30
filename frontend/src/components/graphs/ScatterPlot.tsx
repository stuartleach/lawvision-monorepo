// src/ScatterPlot.tsx

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';
import type {Judge} from 'shared/src/types';
import {targetData} from "../../api";
import {useGraphData, useJudgeData} from "../../hooks/useGraphData";
import {useEffect} from "react";

interface ScatterPlotProps {
    targetNumber: number;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({  targetNumber }) => {
    const {judgeData, isLoading} = useJudgeData(targetData.judges, targetNumber);


    useEffect(() => {
        if (isLoading) return;

        console.log("judges: ", judgeData);

        console.log("graphData: ", judgeData);
    }, [isLoading, judgeData]);

    return (
        <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <axesHelper args={[50]} />
            {/*{judges.map((judge) => (*/}
            {/*    <mesh*/}
            {/*        key={judge.id}*/}
            {/*        position={[judge.ror_count, parseInt(judge.average_bail_set), 0]}*/}
            {/*    >*/}
            {/*        <sphereGeometry args={[1, 32, 32]} />*/}
            {/*        <meshStandardMaterial color={new THREE.Color('blue')} />*/}
            {/*    </mesh>*/}
            {/*))}*/}
            <OrbitControls />
            <Stats />
        </Canvas>
    );
};

export default ScatterPlot;
