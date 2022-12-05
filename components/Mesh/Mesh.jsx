import { Environment, OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import React, { useRef } from 'react';
import {angleToRadians} from '../../utils/angle';
import * as THREE from 'three';
import {gsap} from 'gsap';
import { useIsomorphicLayoutEffect } from 'usehooks-ts'
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Car from './Car';


// Loading Textures
const ball = (type) => `textures/leather/Leather037_1K_${type}.jpg`;
const floor = (type) => `textures/marble/Marble016_1K_${type}.jpg`;


function Mesh() {

    // Ball Textures
    const [
        colorMap,
        displacementMap,
        normalMap,
        roughnessMap,
      ] = useLoader(TextureLoader, [
        ball("Color"),
        ball("Displacement"),
        ball("NormalGL"),
        ball("Roughness"),
      ]);

      // Floor Textures
      const [
        floorcolorMap,
        floordisplacementMap,
        floornormalMap,
        floorroughnessMap,
        flooraoMap
      ] = useLoader(TextureLoader, [
        floor("Color"),
        floor("Displacement"),
        floor("NormalGL"),
        floor("Roughness"),
      ]);

    const orbitControlsRef = useRef(null);

    useFrame((state) => {

        if(!!orbitControlsRef.current){
            const { x, y } = state.mouse;
            orbitControlsRef.current.setAzimuthalAngle(-x * angleToRadians(5));
            orbitControlsRef.current.setPolarAngle((y + 5.5) * angleToRadians(5));
            orbitControlsRef.current.update();
        }
    });

    const t1 = gsap.timeline();
 
    let ballRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        let ctx = gsap.context(() => {
        t1.to(ballRef.current.position, {
            duration: 2,
            x: 1,
            ease: "power2.out",
            
        })
        .from(ballRef.current.position, {
            y: 2,
            duration: 2,
            ease: "bounce.out",
        },">");
    }, ballRef); // <- scopes all selector text to the root element

    return () => ctx.revert();
    }, )

  return (
    <>
    {/* Perspective Camera */}
    <PerspectiveCamera makeDefault position={[0, 2, 5]}/>

    <OrbitControls ref={orbitControlsRef} autoRotate
        // minPolarAngle={angleToRadians(60)}
        // maxPolarAngle={angleToRadians(80)}
    /> 

    {/* Ball */}
    <mesh position={[0, 0.5, 0]} castShadow ref={ballRef}>
        <sphereGeometry args={[0.5, 100, 100]}/>
        <meshStandardMaterial 
        displacementScale={0}
        map={colorMap}
        displacementMap={displacementMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        />
    </mesh>

    {/* Car */}
    <Car castShadow />

    {/* Floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial 
         displacementScale={0}
         map={floorcolorMap}
         displacementMap={floordisplacementMap}
         normalMap={floornormalMap}
         roughnessMap={floorroughnessMap}
        />
    </mesh>

    {/* Ambient Light */}
    <ambientLight intensity={0.4} />
    <directionalLight
      castShadow
      position={[2.5, 8, 5]}
      intensity={1.5}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-far={50}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
    />
    <pointLight position={[-10, 0, -20]} color={'#fff'} intensity={2.5} />
    <pointLight position={[0, -10, 0]} intensity={1.5} />

    {/* Environment */}
    <Environment background near={1} far={1000} resolution={256}>
        <mesh scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial color={'#068b85'} side={THREE.BackSide} />
        </mesh>
    </Environment>
    

    </>
  )
}

export default Mesh