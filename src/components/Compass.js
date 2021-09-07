import React, { useRef, useState } from 'react'

export const Compass = ({ color = 'green', position = [8, 0, 0], dimensions = [2, 3, 3], rotation = [0, 0, 0] }) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef()

    // Set up state for the hovered and active state

    return (
        <mesh
            ref={mesh}
            scale={[1, 1, 1]}
            position={position}
            rotation={rotation}
        >
            <coneBufferGeometry args={dimensions} />
            <meshStandardMaterial color={color} />
        </mesh >

    )
}