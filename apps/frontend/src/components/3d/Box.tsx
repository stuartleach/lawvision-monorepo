import React, {useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'

function Box(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += delta))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
        </mesh>
    )
}

const Sphere = (props) => {
    const ref = useRef()
    useFrame((state, delta) => (ref.current.rotation.y += delta))
    return (
        <mesh
            {...props}
            ref={ref}
            scale={1}
            onClick={(event) => console.log('clicked')}
            onPointerOver={(event) => console.log('hover')}
            onPointerOut={(event) => console.log('unhover')}

        >
            <sphereGeometry args={[1, 32, 32]}/>
            <meshStandardMaterial color={'green'}/>
        </mesh>
    )

}

const ThreeCanvas = () => {
    return (
        <Canvas className={"bg-blue-300"}>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
            <Box position={[0, 0, 0]}/>
            <Sphere position={[0, 0, 0]}/>
        </Canvas>
    )
}

export {ThreeCanvas, Box}