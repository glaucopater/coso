import React, { useEffect, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useHotkeys } from 'react-hotkeys-hook'
import { Controls } from "../../components/Controls";
import { Plane } from "../../components/Plane";
import { Box } from "../../components/Box";
import { MAX_AREA_SIZE, GAME_SETTINGS } from "../../settings";
import { changePlayerPosition, obeyLimits, timedLoopArray } from "../../utils";


export const GameArea = () => {
    const [playerPosition, setPlayerPosition] = useState([0, 0, 0])
    const [positionsLog, setPositionLog] = useState([]);
    const [x, , z] = playerPosition;
    const [isCleared, setIsCleared] = useState(false);
    const [counter, setCounter] = useState(0);
    const zippedPositions = positionsLog.map(pos => pos.join(""));
    const uniquePositions = [...new Set(zippedPositions)];
    const cleanedTiles = positionsLog.map((tile, index) => <Box key={index.toString()} {...GAME_SETTINGS.tile} position={tile} />)
    const planeArea = (MAX_AREA_SIZE - 1) * (MAX_AREA_SIZE - 1);
    const player = <Box {...GAME_SETTINGS.player} position={playerPosition} />

    //definition of N S E O should be visibible --> compass?

    useHotkeys('right', () => {
        if (obeyLimits(x + 1, z)) {
            setPositionLog((prevState) => [...prevState, playerPosition]);
            return changePlayerPosition('right', setPlayerPosition);
        }
    }, [x, z]);

    useHotkeys('left', () => {
        if (obeyLimits(x - 1, z)) {
            setPositionLog((prevState) => [...prevState, playerPosition]);
            return changePlayerPosition('left', setPlayerPosition);
        }
    }, [x, z]);

    useHotkeys('up', () => {
        if (obeyLimits(x, z - 1)) {
            setPositionLog((prevState) => [...prevState, playerPosition]);
            return changePlayerPosition('up', setPlayerPosition);
        }
    }, [x, z]);

    useHotkeys('down', () => {
        if (obeyLimits(x, z + 1)) {
            setPositionLog((prevState) => [...prevState, playerPosition]);
            return changePlayerPosition('down', setPlayerPosition);
        }
    }, [x, z]);

    useHotkeys('space', () => {
        timedLoopArray(positionsLog.reverse(), 500, setPlayerPosition);
    }, [positionsLog]);

    useEffect(() => {
        if (uniquePositions.length >= planeArea) {
            setIsCleared(true);
        }
    }, [isCleared, uniquePositions, positionsLog]
    )

    useEffect(() => {
        if (isCleared && counter == 0) {
            timedLoopArray(positionsLog.reverse(), 500, setPlayerPosition).then(() => {
                setCounter(1);
                console.log("timedLoopArray over");
            });
        }
    }, [isCleared, counter]
    )

    return (
        <>
            <Canvas camera={{ position: [0, 5, 10] }}>
                <Controls />
                <ambientLight intensity={0.9} />
                <spotLight position={[1, 1, 1]} angle={0.15} penumbra={1} />
                <pointLight position={[-1, -1, -1]} />
                {counter == 0 && player}
                {cleanedTiles}
                <Plane {...GAME_SETTINGS.plane} />
            </Canvas >
        </>
    )
}
