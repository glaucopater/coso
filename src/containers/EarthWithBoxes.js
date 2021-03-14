import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { Controls } from '../components/Controls'
import * as THREE from 'three'
import { fetchLiveData, RADIUS_SPHERE, convertLatLon, latLongToVector3 } from "../utils"
import data from "../data/countries_min.json"

const makeUrl = (file) => `https://raw.githubusercontent.com/flowers1225/threejs-earth/master/src/img/${file}.jpg`

const LOOK_AT_COORDS = [0, 0, 0]

const Vaccination3dBar = (props) => {
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


const Earth = () => {

  const [liveData, setLiveData] = React.useState([]);

  React.useEffect(async () => {
    const result = await fetchLiveData(liveData);
    setLiveData(result);
  }, [fetchLiveData])


  const [texture, bump] = useLoader(THREE.TextureLoader, [makeUrl('earth4'), makeUrl('earth_bump')])
  const ref = useRef()
  const radium = RADIUS_SPHERE;

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
          return <Vaccination3dBar
            key={name}
            position={point}
            population={population}
            vaccinations={vaccinations}
            onClick={(e) => {
              console.log(name, population.toLocaleString(), vaccinations.toLocaleString(),
                e.point.x, e.point.y, e.point.z, convertLatLon([e.point.x, e.point.y, e.point.z]))
            }}
          />
      })
      }
      <mesh visible position={[0, 0, 0]}>
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
      </Canvas>
    </>
  )
}
