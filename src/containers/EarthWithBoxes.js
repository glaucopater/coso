import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { Controls } from '../components/Controls'
import * as THREE from 'three'
import { fetchLiveData, RADIUS_SPHERE, convertLatLon, latLongToVector3 } from "../utils"
import data from "../data/countries_min.json"

const makeUrl = (file) => `https://raw.githubusercontent.com/flowers1225/threejs-earth/master/src/img/${file}.jpg`

const LOOK_AT_COORDS = [0, 0, 0]

const MyCube = (props) => {
  const mesh = useRef()
  const { position, onClick, vaccinations, population } = props;
  useEffect(() => {
    mesh.current.lookAt(...LOOK_AT_COORDS)
  }, [mesh])

  const boxDimensions = [1, 1, vaccinations * 100 / population]
  return (
    <mesh position={position} ref={mesh} scale={[0.1, 0.1, 0.1]}
      onClick={onClick}
    >
      <boxBufferGeometry args={boxDimensions} />
      <meshNormalMaterial />
    </mesh>
  )
}


export const Box = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef()


  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => {
  //   if (active) {
  //     mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  //   }
  // })

  const { position, setCounter } = props
  const boxDimensions = [1, 1, 10]
  const boxScale = [1, 1, 1]

  const handleOnClick = () => {
    setActive(!active)
    //setCounter((prevCounter) => prevCounter + 1)
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
      lookAt={new THREE.Vector3(0, 0, 0)}
      onPointerOut={() => setHover(false)}
      onClick={onClick}>
      <boxBufferGeometry args={boxDimensions} />
      <meshStandardMaterial color={hovered ? 'red' : 'grey'} />
    </mesh >
  )
}


const Earth = () => {

  const [liveData, setLiveData] = React.useState([]);

  React.useEffect(async () => {
    const result = await fetchLiveData(liveData);
    setLiveData(result);
  }, [fetchLiveData])


  const [texture, bump] = useLoader(THREE.TextureLoader, [makeUrl('earth4'), makeUrl('earth_bump')])
  const ref = useRef()
  const radium = RADIUS_SPHERE

  useFrame(() => {
    // ref.current.rotation.y += 0.001
  })

  const points = data.map(([name, lat, long]) => {
    const country = liveData.length > 0 && liveData.filter(item => item.location === name) || null
    const population = country && country[0] && country[0].population || 0
    const vaccinations = country && country[0] && country[0].vaccinations || 0
    return {
      name,
      point: latLongToVector3(lat, long, 5, 2),
      population: population,
      vaccinations: vaccinations
    }
  })

  if (!liveData) {
    console.log(liveData)
    return <group ref={ref} name="loading"></group>
  }

  return (
    <group ref={ref} name="earth">
      {points.map(({ name, point, population, vaccinations }) => {
        if (population > 0)
          return <MyCube
            key={name}
            position={point}
            population={population}
            vaccinations={vaccinations}
            onClick={(e) => {
              console.log(name, population.toLocaleString(), vaccinations.toLocaleString(),
                e.point.x, e.point.y, e.point.z, convertLatLon([e.point.x, e.point.y, e.point.z]))
            }}
          />

        // return <mesh
        //   key={name}
        //   scale={[3.1, 0.1, 0.1]}
        //   position={point}
        //   lookAt={(new THREE.Vector3(0, 0, 0))}

        //   //rotation={[45, 0, 0]}
        //   onClick={(e) => {
        //     console.log(name, population.toLocaleString(), vaccinations.toLocaleString(),
        //       e.point.x, e.point.y, e.point.z, convertLatLon([e.point.x, e.point.y, e.point.z]))
        //   }}>
        //   <boxBufferGeometry args={[1, 1, 1]} />
        //   <meshStandardMaterial color={'#ff0000'} />
        // </mesh>
      })
      }
      <mesh
        visible
        position={[0, 0, 0]}
      >
        <sphereBufferGeometry attach="geometry" args={[radium, 64, 64]} />
        <meshStandardMaterial attach="material" map={texture} bumpMap={bump} bumpScale={0.05} />
      </mesh>
    </group >
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
        {/* <Box position={[5, 0, 0]} lookAt={(new THREE.Vector3(0, 0, 0))} />
        <Box position={[10, 0, 0]} />
        <Box position={[15, 0, 0]} /> */}
        {/* <MyCube position={[2 * 4, 0, 0]} />
        <MyCube position={[4 * 4, 0, 0]} />
        <MyCube position={[0, 2 * 4, 0]} />
        <MyCube position={[0, 4 * 4, 0]} />
        <MyCube position={[0, 0, 2 * 4]} />
        <MyCube position={[0, 4, 4 * 4]} /> */}
      </Canvas>
    </>
  )
}
