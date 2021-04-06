import React, { useEffect, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useHotkeys } from 'react-hotkeys-hook'
import { Controls } from "../../components/Controls";
import { Plane } from "../../components/Plane";
import { Box } from "../../components/Box";
import { MAX_PLANE_SIZE, MAX_AREA_SIZE, GAME_SETTINGS } from "../../settings";
import { changePlayerPosition } from "../../utils";



const obeyLimits = (x, z) => {
    return (x <= MAX_PLANE_SIZE && x >= -MAX_PLANE_SIZE && z >= -MAX_PLANE_SIZE && z <= MAX_PLANE_SIZE);
}

export const GameArea = () => {
    const [position, setPosition] = useState([0, 0, 0])
    const [positionsLog, setPositionLog] = useState([]);
    const [x, , z] = position;
    const [isCleared, setIsCleared] = useState(false);
    const zippedPositions = positionsLog.map(pos => pos.join(""));
    const uniquePositions = [...new Set(zippedPositions)];
    const cleanedTiles = positionsLog.map((tile, index) => <Box key={index.toString()} {...GAME_SETTINGS.tile} position={tile} />)
    const planeArea = (MAX_AREA_SIZE - 1) * (MAX_AREA_SIZE - 1);
    const player = <Box {...GAME_SETTINGS.player} position={position} />

    //definition of N S E O should be visibible --> compass?

    useHotkeys('right', () => {
        if (obeyLimits(x + 1, z)) {
            setPositionLog((prevState) => [...prevState, position]);
            return changePlayerPosition('right', setPosition);
        }
    }, [x, z]);

    useHotkeys('left', () => {
        if (obeyLimits(x - 1, z)) {
            setPositionLog((prevState) => [...prevState, position]);
            return changePlayerPosition('left', setPosition);
        }
    }, [x, z]);

    useHotkeys('up', () => {
        if (obeyLimits(x, z - 1)) {
            setPositionLog((prevState) => [...prevState, position]);
            return changePlayerPosition('up', setPosition);
        }
    }, [x, z]);

    useHotkeys('down', () => {
        if (obeyLimits(x, z + 1)) {
            setPositionLog((prevState) => [...prevState, position]);
            return changePlayerPosition('down', setPosition);
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
                <Plane {...GAME_SETTINGS.plane} />
            </Canvas >
        </>
    )
}
