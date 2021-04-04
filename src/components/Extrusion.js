import React, { useMemo } from 'react'
import * as THREE from 'three'


export function Extrusion({ start = [0, 0], paths, ...props }) {
    const shape = useMemo(() => {
        const shape = new THREE.Shape()
        shape.moveTo(...start)
        paths.forEach((path) => shape.bezierCurveTo(...path))
        return shape
    }, [start, paths])
    return (
        <mesh>
            <extrudeGeometry args={[shape, props]} />
            <meshPhongMaterial />
        </mesh>
    )
}