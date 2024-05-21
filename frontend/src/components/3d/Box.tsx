import * as React from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Physics, useSphere, useCylinder } from '@react-three/cannon';

interface AtomProps {
    position: [number, number, number];
    color: string;
    setPosition: (index: number, position: [number, number, number]) => void;
    index: number;
    setRef: (index: number, mesh: THREE.Mesh | null) => void;
}

const Atom: React.FC<AtomProps> = ({ position, color, setPosition, index, setRef }) => {
    const [sphereRef, api] = useSphere(() => ({ mass: 1, position }));

    useEffect(() => {
        const unsubscribe = api.position.subscribe((pos) => {
            setPosition(index, [pos[0], pos[1], pos[2]]);
        });
        return () => unsubscribe();
    }, [api.position, index, setPosition]);

    return (
        <TransformControls object={sphereRef.current} mode="translate">
            <mesh ref={(el) => setRef(index, el)}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </TransformControls>
    );
};

interface BondProps {
    startRef: React.MutableRefObject<THREE.Mesh | null>;
    endRef: React.MutableRefObject<THREE.Mesh | null>;
}

const Bond: React.FC<BondProps> = ({ startRef, endRef }) => {
    if (!startRef.current || !endRef.current) return null;

    const startVector = new THREE.Vector3().setFromMatrixPosition(startRef.current.matrixWorld);
    const endVector = new THREE.Vector3().setFromMatrixPosition(endRef.current.matrixWorld);
    const midPoint = new THREE.Vector3().addVectors(startVector, endVector).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(endVector, startVector);
    const length = dir.length();

    return (
        <mesh position={midPoint} rotation={new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().lookAt(startVector, endVector, new THREE.Vector3(0, 1, 0)))}>
            <cylinderGeometry args={[0.1, 0.1, length, 32]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
};

const Molecule: React.FC = () => {
    const initialAtoms = [
        { position: [0, 0, 0], color: 'red' },
        { position: [1, 1, 0], color: 'blue' },
        { position: [1, -1, 0], color: 'green' },
    ];

    const initialBonds = [
        { start: 0, end: 1 },
        { start: 0, end: 2 },
    ];

    const [atoms, setAtoms] = useState(initialAtoms);
    const [bonds, setBonds] = useState(initialBonds);
    const refs = useRef<(THREE.Mesh | null)[]>(new Array(initialAtoms.length).fill(null));

    const setPosition = useCallback((index: number, position: [number, number, number]) => {
        setAtoms((prevAtoms) => {
            const newAtoms = [...prevAtoms];
            newAtoms[index] = { ...newAtoms[index], position };
            return newAtoms;
        });
    }, []);

    const addAtom = useCallback((position: [number, number, number], color: string, bondStart: number) => {
        const newAtomIndex = atoms.length;
        setAtoms((prevAtoms) => [
            ...prevAtoms,
            { position, color }
        ]);
        setBonds((prevBonds) => [
            ...prevBonds,
            { start: bondStart, end: newAtomIndex }
        ]);
        refs.current.push(null); // Ensure the refs array stays in sync
    }, [atoms.length]);

    const setRef = useCallback((index: number, mesh: THREE.Mesh | null) => {
        refs.current[index] = mesh;
    }, []);

    useEffect(() => {
        addAtom([2, 1, 0], 'yellow', 1);
    }, [addAtom]);

    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            {/*<OrbitControls />*/}
           {/* <Physics>
                {atoms.map((atom, index) => (
                    <Atom key={index} index={index} position={atom.position} color={atom.color} setPosition={setPosition} setRef={setRef} />
                ))}
                {bonds.map((bond, index) => (
                    <Bond key={index} startRef={{ current: refs.current[bond.start] }} endRef={{ current: refs.current[bond.end] }} />
                ))}
            </Physics>*/}
        </Canvas>
    );
};

export default Molecule;
