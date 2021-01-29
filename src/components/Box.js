import React, { useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'


export const Box = (props) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
        if (active) {
            mesh.current.rotation.x = mesh.current.rotation.y += 0.01
        }
    })

    const { position } = props

    const boxDimensions = [1, 1, 1]

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={[1, 1, 1]}
            position={position}
            onClick={(e) => setActive(!active)}
            onPointerOver={(e) => setHover(true)}
            onPointerOut={(e) => setHover(false)}>
            <boxBufferGeometry args={boxDimensions} />
            <meshStandardMaterial color={hovered ? 'red' : 'orange'} />
        </mesh>
    )
}