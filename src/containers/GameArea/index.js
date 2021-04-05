import React, { useEffect, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useHotkeys } from 'react-hotkeys-hook'
import { Controls } from "../../components/Controls";
import { Plane } from "../../components/Plane";
import { Box } from "../../components/Box";


const MAX_AREA_SIZE = 10;
const MAX_PLANE_SIZE = MAX_AREA_SIZE / 2 - 1

const defaultSettings = {
    plane: {
        color: "#ccc",
        dimensions: [MAX_AREA_SIZE, 1, MAX_AREA_SIZE]
    },
    player: {
        color: "#45f",
    },
    tile: {
        color: "#33ff33",
        dimensions: [1, 0, 1]
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
    return (x <= MAX_PLANE_SIZE && x >= -MAX_PLANE_SIZE && z >= -MAX_PLANE_SIZE && z <= MAX_PLANE_SIZE);
}

export const GameArea = () => {
    const [position, setPosition] = useState([0, 0, 0])
    const [positionsLog, setPositionLog] = useState([]);
    const [x, y, z] = position;
    const [isCleared, setIsCleared] = useState(false);
    const zippedPositions = positionsLog.map(pos => pos.join(""));
    const uniquePositions = [...new Set(zippedPositions)];
    // const zippedUniquePositions = uniquePositions.map(pos => pos.split("").map(n => n * 1)) // problem with minus
    // console.log(positionsLog, zippedPositions, uniquePositions);
    const cleanedTiles = positionsLog.map((tile, index) => <Box key={index.toString()} {...defaultSettings.tile} position={tile} />)
    const planeArea = (MAX_AREA_SIZE - 1) * (MAX_AREA_SIZE - 1);
    const player = <Box {...defaultSettings.player} position={position} />

    //definition of N S E O should be visibible --> compass?

    useHotkeys('right', () => {
        if (obeyLimits(x + 1, z)) {
            setPositionLog((prevState) => [...prevState, position]);
            return changePosition('right', setPosition);
        }
    }, [x, z]);

    useHotkeys('left', () => {
        if (obeyLimits(x - 1, z)) {
            setPositionLog((prevState) => [...prevState, position]);
            return changePosition('left', setPosition);
        }
    }, [x, z]);

    useHotkeys('up', () => {
        if (obeyLimits(x, z - 1)) {
            setPositionLog((prevState) => [...prevState, position]);
            return changePosition('up', setPosition);
        }
    }, [x, z]);

    useHotkeys('down', () => {
        if (obeyLimits(x, z + 1)) {
            setPositionLog((prevState) => [...prevState, position]);
            return changePosition('down', setPosition);
        }
    }, [x, z]);

    useHotkeys('space', () => {
        console.log("space")
    });

    useEffect(() => {
        if (uniquePositions.length >= planeArea) {
            console.log("Stage Cleared");
            setIsCleared(true);
        }
    }, [uniquePositions, planeArea, setIsCleared]
    )



    return (
        <>
            <Canvas camera={{ position: [0, 5, 10] }}>
                <Controls />
                <ambientLight intensity={0.9} />
                <spotLight position={[1, 1, 1]} angle={0.15} penumbra={1} />
                <pointLight position={[-1, -1, -1]} />
                {!isCleared && player}
                {cleanedTiles}
                <Plane {...defaultSettings.plane} />
            </Canvas >
        </>
    )
}
