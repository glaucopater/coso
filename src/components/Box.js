import React, { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from 'react-three-fiber'

export const Box = ({ color = '#f00', position = [0, 0, 0], dimensions = [1, 1, 1] }) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    const {
        gl,                           // WebGL renderer
        scene,                        // Default scene
        camera,                       // Default camera
        raycaster,                    // Default raycaster
        size,                         // Bounds of the view (which stretches 100% and auto-adjusts)
        aspect,                       // Aspect ratio (size.width / size.height)
        mouse,                        // Current, centered, normalized 2D mouse coordinates
        clock,                        // THREE.Clock (useful for useFrame deltas)
        invalidate,
        intersect,
        setDefaultCamera,
        viewport,
        forceResize,
    } = useThree()


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


    return (
        <mesh
            ref={mesh}
            scale={[1, 1, 1]}
            position={position}
            onClick={(e) => setActive(!active)}
            onPointerOver={(e) => setHover(true)}
            onPointerOut={(e) => setHover(false)}
        // onUpdate={(self) => console.log('props have been updated', self)}
        >
            <boxBufferGeometry args={dimensions} />
            <meshStandardMaterial color={activeColor} />
        </mesh>

    )
}