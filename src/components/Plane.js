import React, { useRef } from 'react'

export const Plane = ({ position = [0, -1, 0], dimensions = [10, 1, 10], color = "green", scale = [1, 1, 1] }) => {
    const mesh = useRef();

    return (
        <mesh ref={mesh} scale={scale} position={position}>
            <boxBufferGeometry args={dimensions} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}