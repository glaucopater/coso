import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { Controls } from '../components/Controls'
import * as THREE from 'three'


const makeUrl = (file) => `https://raw.githubusercontent.com/flowers1225/threejs-earth/master/src/img/${file}.jpg`


const fixedPoints = [
  [5, 3, 4],
  [2, 6, 3],
  [5, 4, 3],
  [5, 1, 5],
  [4, 3, 5],
  [0, 5, 5],
  [5, 5, -7],
  [5, 5, -1],
  [5, 5, 0],
  [5, 5, 1],
  [5, 5, 2],
  [5, 5, 3],
  [5, 5, 4],
  [5, 5, 5],
  [5, 5, 6],
  [5, 5, 7]
];



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

  const { position, setCounter } = props
  const boxDimensions = [1, 1, 1]
  const boxScale = [0.1, 0.1, 0.1]

  const handleOnClick = () => {
    setActive(!active)
    setCounter((prevCounter) => prevCounter + 1)
    setHover(true)
  }

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={boxScale}
      position={position}
      onClick={handleOnClick}
      onPointerOver={handleOnClick}
      onPointerOut={() => setHover(false)}>
      <boxBufferGeometry args={boxDimensions} />
      <meshStandardMaterial color={hovered ? 'red' : 'grey'} />
    </mesh>
  )
}

/**
 *  (x - a)² + (y - b)² + (z - c)² = r²
 * 
 * 
 * x = r * cos(s) * sin(t)
 * y = r * sin(s) * sin(t)
 * z = r * cos(t)
 * 
 */
const findPointsOnSphere = (d) => {
  const points = [];
  const minRange = 0;
  const maxRange = 24;
  for (var ss = minRange; ss < maxRange; ss++) {
    for (var tt = 0; tt <= 12; tt++) {
      const s = Math.PI * ss / 12;
      const t = Math.PI * tt / 12;
      var x = d * Math.cos(s) * Math.sin(t);
      var y = d * Math.sin(s) * Math.sin(t);
      var z = d * Math.cos(t);
      points.push([x, y, z])
    }
  }
  return points
}

const Earth = () => {
  const [texture, bump] = useLoader(THREE.TextureLoader, [makeUrl('earth4'), makeUrl('earth_bump')])
  const ref = useRef()

  useFrame(() => {
    // ref.current.rotation.y += 0.001
  })


  const points = findPointsOnSphere(7);
  console.log(points);

  return (
    <group ref={ref} name="earth">
      {points.map((pos, index) => (
        <mesh
          key={index.toString()}
          scale={[0.1, 0.1, 0.1]}
          position={pos}
          onClick={(e) => {
            console.log(e.point.x, e.point.y, e.point.z)
          }}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={'#ff0000'} />
        </mesh>
      ))}
      <mesh visible position={[0, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[7, 64, 64]} />
        <meshStandardMaterial attach="material" map={texture} bumpMap={bump} bumpScale={0.05} />
      </mesh>
    </group>
  )
}


export default function EarthWithBoxes() {
  return (
    <>
      <Canvas camera={{ position: [0, 10, 20], fov: 40 }}>
        <color attach="background" args={['black']} />
        <Controls />
        <ambientLight intensity={0.9} />
        <spotLight position={[1, 1, 1]} angle={0.15} penumbra={1} />
        <pointLight position={[-2, -1, -1]} />
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
      </Canvas>
    </>
  )
}
