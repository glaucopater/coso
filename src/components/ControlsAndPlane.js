import React, { useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useHotkeys } from 'react-hotkeys-hook'
import { Controls } from "./Controls";
import { Plane } from "./Plane";
import { Box } from "./Box";

export const ControlsAndPlane = () => {
    const [position, setPosition] = useState([0, 0, 0])

    useHotkeys('right', () => setPosition((prevPos) => [prevPos[0] + 1, prevPos[1], prevPos[2]]))
    useHotkeys('left', () => setPosition((prevPos) => [prevPos[0] - 1, prevPos[1], prevPos[2]]))
    useHotkeys('up', () => setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] - 1]))
    useHotkeys('down', () => setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] + 1]))

    return (
        <>
            <Controls />
            <ambientLight intensity={0.9} />
            <spotLight position={[1, 1, 1]} angle={0.15} penumbra={1} />
            <pointLight position={[-1, -1, -1]} />
            <Box position={position} />
            <Plane />
        </>
    )
}
