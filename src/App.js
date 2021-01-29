import React from 'react'
import { Canvas } from 'react-three-fiber'
import { ControlsAndPlane } from "./components/ControlsAndPlane"


export default function App() {
  return (
    <>
      <Canvas >
        <ControlsAndPlane />
      </Canvas>
    </>
  )
}
