import React, { useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useHotkeys } from 'react-hotkeys-hook'
import { Controls } from "../../components/Controls";
import { Plane } from "../../components/Plane";
import { Box } from "../../components/Box";

const defaultSettings = {
    plane: {
        color: "#ccc",
    },
    player: {
        color: "#45f",
    }
}

export const changePosition = (action, setPosition) => {
    switch (action) {
        case "right":
            setPosition((prevPos) => [prevPos[0] + 1, prevPos[1], prevPos[2]]);
            break;
        case "left":
            setPosition((prevPos) => [prevPos[0] - 1, prevPos[1], prevPos[2]])
            break;
        case "up":
            setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] - 1])
            break;
        case "down":
            setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] + 1]);
            break;
    }
}

const obeyLimits = (x, z) => {
    return (x <= 4 && x >= -4 && z >= -4 && z <= 4);
}

export const GameArea = () => {
    const [position, setPosition] = useState([0, 0, 0])
    const [positionsLog, setPositionLog] = useState([]);
    const [x, y, z] = position;

    //definition of N S E O should be visibible --> compass?

    useHotkeys('right', () => {
        if (obeyLimits(x + 1, z)) {
            setPositionLog((prevState) => [...prevState, "right"]);
            return changePosition('right', setPosition);
        }
    }, [x, z]);

    useHotkeys('left', () => {
        if (obeyLimits(x - 1, z)) {
            setPositionLog((prevState) => [...prevState, "left"]);
            return changePosition('left', setPosition);
        }
    }, [x, z]);

    useHotkeys('up', () => {
        if (obeyLimits(x, z - 1)) {
            setPositionLog((prevState) => [...prevState, "up"]);
            return changePosition('up', setPosition);
        }
    }, [x, z]);

    useHotkeys('down', () => {
        if (obeyLimits(x, z + 1)) {
            setPositionLog((prevState) => [...prevState, "down"]);
            return changePosition('down', setPosition);
        }
    }, [x, z]);

    useHotkeys('space', () => {
        console.log("space")
    });

    const defaultCanvasProps = {
        fov: 75,
        near: 0.1,
        far: 10,
        z: 5
    };

    return (
        <>
            <Canvas
                //orthographic
                // {...defaultCanvasProps}
                camera={{ position: [0, 5, 10] }}
            >
                <Controls />
                <ambientLight intensity={0.9} />
                <spotLight position={[1, 1, 1]} angle={0.15} penumbra={1} />
                <pointLight position={[-1, -1, -1]} />
                <Box {...defaultSettings.player} position={position} />
                <Plane {...defaultSettings.plane} />
            </Canvas >
        </>
    )
}
