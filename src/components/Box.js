import React, { useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'

export const Box = ({ color = '#f00', position = [0, 0, 0], dimensions = [1, 1, 1], clickable = false }) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef()

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    const [activeColor, setActiveColor] = useState(color)

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
        if (active) {
            mesh.current.rotation.x = mesh.current.rotation.y += 0.01
            if (Math.ceil(mesh.current.rotation.x) < 256) {
                const color = "rgb(" + Math.ceil(mesh.current.rotation.x) + ",255,255)";
                setActiveColor(color)
            }
        }
    })

    const handleOnClick = () => {
        setActive(!active);
    }


    const events = {
        ...(clickable &&
            { onClick: handleOnClick }
        ),
        onPointerOver: () => setHover(true),
        onPointerOut: () => setHover(false)
        // onUpdate={(self) => console.log('props have been updated', self)}
    };

    return (
        <mesh
            ref={mesh}
            scale={[1, 1, 1]}
            position={position}
            {...events}
        >
            <boxBufferGeometry args={dimensions} />
            <meshStandardMaterial color={activeColor} />
        </mesh >

    )
}