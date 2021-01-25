import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber'
import { useHotkeys } from 'react-hotkeys-hook'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

const Plane = (props) => {
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

const Box = (props) => {
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

const Controls = () => {
  const { camera, gl, invalidate } = useThree()
  const ref = useRef()
  useFrame(() => ref.current.update())
  useEffect(() => void ref.current.addEventListener('change', invalidate), [invalidate])
  return <orbitControls ref={ref} enableDamping args={[camera, gl.domElement]} />
}

export default function App() {
  const [position, setPosition] = useState([0, 0, 0])

  useHotkeys('right', () => setPosition((prevPos) => [prevPos[0] + 1, prevPos[1], prevPos[2]]))
  useHotkeys('left', () => setPosition((prevPos) => [prevPos[0] - 1, prevPos[1], prevPos[2]]))
  useHotkeys('up', () => setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] - 1]))
  useHotkeys('down', () => setPosition((prevPos) => [prevPos[0], prevPos[1], prevPos[2] + 1]))

  return (
    <>
      <Canvas >
        <Controls />
        <ambientLight intensity={0.9} />
        <spotLight position={[1, 1, 1]} angle={0.15} penumbra={1} />
        <pointLight position={[-1, -1, -1]} />
        <Box position={position} />
        <Plane />
      </Canvas>
    </>
  )
}
