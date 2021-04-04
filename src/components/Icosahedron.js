import React, { useRef, useState, useCallback } from 'react'
import { useFrame } from 'react-three-fiber'


export function Icosahedron() {
    const [active, set] = useState(false)
    const handleClick = useCallback(e => set(state => !state), [])
    const ref = useRef(undefined)
    useFrame(() => (ref.current.rotation.y += 0.1))
    return (
        <mesh ref={ref} position={[3, 1, 0]} scale={active ? [2, 2, 2] : [1, 1, 1]} onClick={handleClick}>
            <icosahedronBufferGeometry attach="geometry" args={[1, 0]} />
            <meshNormalMaterial attach="material" />
        </mesh>
    )
}