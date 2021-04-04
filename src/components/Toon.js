import * as THREE from "three"
import React from "react"
import { Canvas, extend } from "react-three-fiber"
import { OrbitControls, shaderMaterial } from "@react-three/drei"
import glsl from "babel-plugin-glsl/macro"

const ShaderToonMaterial = shaderMaterial(
    { color: new THREE.Color(0.2, 0.0, 0.1) },
    glsl`varying vec2 vUv;
      // varying mat3 normalMatrix;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,

    glsl`uniform vec3 color;
      varying vec2 vUv;
      struct DirectionalLight {
        vec3 direction;
        vec3 color;
      };

      void main() {
        gl_FragColor = vec4(0.5 + 0.3 * sin(vUv.yxx) + color, 1.0);
      }
    `
)

extend({ ShaderToonMaterial })

export const ShaderPlane = () => (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry args={[250, 100]} />
        <meshPhysicalMaterial color="gray" />
    </mesh>
)

export const ToonSphere = () => {
    return (
        <mesh castShadow recieveShadow scale={[1, 1, 1]} position={[-2, 2, 0]}>
            <sphereBufferGeometry args={[1, 15, 15]} />
            <meshToonMaterial color="gold" />
        </mesh>
    )
}

export const ShaderSphere = () => {
    return (
        <mesh castShadow recieveShadow scale={[1, 1, 1]} position={[2, 2, 0]}>
            <sphereBufferGeometry args={[1, 15, 15]} />
            <shaderToonMaterial color="hotpink" />
        </mesh>
    )
}
