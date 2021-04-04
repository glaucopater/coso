import React, { useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useHotkeys } from 'react-hotkeys-hook'
import { Controls } from "../../components/Controls";
import { Plane } from "../../components/Plane";
import { Box } from "../../components/Box";
import { Icosahedron } from "../../components/Icosahedron";
// import { ToonSphere, ShaderSphere, ShaderPlane } from "../components/Toon";

export const ControlsAndPlane = () => {
    const [position, setPosition] = useState([0, 0, 0])

    useHotkeys('right', () => setPosition((prevPos) => [prevPos[0] + 1, prevPos[1], prevPos[2]]))
    useHotkeys('left', () => setPosition((prevPos) => [prevPos[0] - 1, prevPos[1], prevPos[2]]))
    useHotkeys('up', () => setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] - 1]))
    useHotkeys('down', () => setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] + 1]))

    const defaultCanvasProps = {
        fov: 75, near: 0.1, far: 1000, z: 5
        //    , lookAt: [0, 0, 0]
    };

    const img = "https://picsum.photos/id/237/200/300";

    return (
        <>
            <Canvas {...defaultCanvasProps}>
                <Controls />
                <ambientLight intensity={0.9} />
                <spotLight position={[1, 1, 1]} angle={0.15} penumbra={1} />
                <pointLight position={[-1, -1, -1]} />
                <Box position={position} />
                <Plane />
                <mesh visible userData={{ hello: 'world' }} position={[1, 1, 3]} rotation={[Math.PI / 2, 0, 0]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="hotpink" transparent />
                </mesh>
                <mesh visible userData={{ hello: 'zauardo' }} position={[3, 3, 3]} rotation={[Math.PI / 2, 0, 0]}>
                    <sphereGeometry args={[1, 32]} />
                    <meshStandardMaterial color="gold" transparent opacity={0.5} />
                </mesh>
                <mesh visible userData={{ hello: 'zauardo' }} position={[3, 3, 3]} rotation={[Math.PI / 2, 0, 0]}>
                    <sphereGeometry args={[1, 32]} />
                    <meshStandardMaterial color={('#fF0000')}
                        transparent opacity={0.5} />
                </mesh>
                <Icosahedron />

            </Canvas >

            {/* <Canvas colorManagement shadowMap camera={{ position: [0, 3, 5] }}>
                <ToonSphere />
                <ShaderSphere />
                <ShaderPlane />
                <ambientLight intensity={0.5} />
                <directionalLight castShadow position={[3, 5, 5]} intensity={0.5} />
                <OrbitControls autoRotate={false} target={[0, 2, 0]} />
            </Canvas> */}
        </>
    )
}
