import PropTypes from 'prop-types'; // Import PropTypes
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react'; // Import hooks
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';


export default function ToothCanvas({selectedTooth}) {
    
    const { scene } = useGLTF("/assets/3DModels/CompressedAdultTeeth/all-teeth.glb");

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name) { // Ensure it's a mesh and has a name
                child.visible = false;
            }
        })

        scene.getObjectByName(selectedTooth).visible = true;
    }, [selectedTooth, scene])


    return (
        <div style={{ height: '450px', width: '100%' }}>
            <Suspense fallback={<h3>Loading Tooth 3D model...</h3>}>
                <Canvas style={{ height: '100%', width: '100%' }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[0, 10, 5]} intensity={2.0} />
                    
                    <primitive object={scene} scale={65} />
                    
                    <OrbitControls enableZoom={false} enablePan={false} enableDamping={false}/>
                </Canvas>
            </Suspense>
        </div>
    );
}

ToothCanvas.propTypes = {
        selectedTooth: PropTypes.string.isRequired
    }