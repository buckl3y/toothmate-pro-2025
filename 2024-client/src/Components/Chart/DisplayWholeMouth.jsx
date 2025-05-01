import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model() {
  // Path is relative to the public directory
  const { scene } = useGLTF('/assets/3DModels/AdultTeeth/adult_whole_mouth.glb');
  return <primitive object={scene} scale={1} />; // Adjust scale as needed
}

function DisplayWholeMouth() {
  return (
    <Canvas style={{ height: '500px', width: '100%' }}> {/* Adjust size as needed */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

export default DisplayWholeMouth;
