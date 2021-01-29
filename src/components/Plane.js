import React, { useRef } from 'react'

export const Plane = (props) => {
    const mesh = useRef()

    const position = [0, -1, 0]
    const boxDimensions = [10, 1, 10]

    return (
        <mesh {...props} ref={mesh} scale={[1, 1, 1]} position={position}>
            <boxBufferGeometry args={boxDimensions} />
            <meshStandardMaterial color={'green'} />
        </mesh>
    )
}