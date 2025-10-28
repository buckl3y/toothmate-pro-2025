import PropTypes from 'prop-types'; // Import PropTypes
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react'; // Import hooks
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

/**
 * Component to render a single tooth.
 * 
 * Used to show the 3D model of the currently selected tooth.
 * 
 * @author Skye Pooley
 */
export default function ToothCanvas({selectedTooth}) {
    
    const { scene } = useGLTF("/assets/3DModels/CompressedAdultTeeth/all-teeth.glb");

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name) { // Ensure it's a mesh and has a name
                child.visible = false;
            }
        })

        const visibleTooth = scene.getObjectByName(selectedTooth)
        if (visibleTooth) { visibleTooth.visible = true; }
    }, [selectedTooth, scene])


    return (
        <div style={{ height: '40vh', width: '100%' }}>
            <Suspense fallback={<h3>Loading Tooth 3D model...</h3>}>
                <Canvas style={{ height: '100%', width: '100%' }}>
                    <ambientLight intensity={2.5} />
                    <directionalLight position={[0, 10, 5]} intensity={1.0} />
                    
                    <primitive object={scene} scale={55} />
                    
                    <OrbitControls enableZoom={false} enablePan={false} enableDamping={false}/>
                </Canvas>
            </Suspense>
        </div>
    );
}

ToothCanvas.propTypes = {
        selectedTooth: PropTypes.string.isRequired
    }