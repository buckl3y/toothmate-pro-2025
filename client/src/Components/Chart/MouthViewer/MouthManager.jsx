/*
    3D view of the mouth. Does not include any interface.
    Allows panning and scrolling of the model.
    Highlights teeth with treatments.

    authors:
        - Whole Team
            - 3d/3d Switch
            - Bugfixes
            - Camera Controls
            - Layout
        - Skye Pooley
            - Fetching and displaying tooth treatments.
            - Flat Mouth View
        Jim Buchan 
            - Loading mouth 3D models into three.js

*/

import { Suspense, useState } from 'react'; // Import hooks
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import PropTypes from 'prop-types'; // Import PropTypes


import MouthCanvas from './MouthCanvas';
import { useRef } from 'react';


// Component which holds the 3D model and handles interactions.
export default function MouthManager({mouthData, onToothSelected}) {
    // Change state to hold an array of selected teeth
    const [selectedTooth, setselectedTooth] = useState();
    const [is3DView, setIs3DView] = useState(true);
    const controlsRef = useRef(); // Allows programatic control of camera.

    // Select / Deselect teeth when clicked.
    const handleMeshClick = (meshName) => {
        if (selectedTooth == meshName) {
            setselectedTooth(null);
            onToothSelected(null)
        }
        else {
            setselectedTooth(meshName);
            onToothSelected(meshName)
        }
    }

    function handleViewChanged(is3d) {
        setIs3DView(is3d);
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    }

    // Linter throws a fuss if we don't have this but it doesn't seem to be used.. mysteries never cease.
    function loadingPlaceholder() {
        return (
            <>
                <h3>Loading Patient Chart...</h3>
            </>
        )
    }

    return (
        <div style={{ position: 'relative', height: '800px', width: '100%' }}>

            {is3DView ? (
                <>
                    <button id="view-change-button" onClick={()=>handleViewChanged(!is3DView)}>
                        2D View
                    </button>
                </>
            ) : (
                <>
                    <button id="view-change-button" onClick={()=>handleViewChanged(!is3DView)}>
                        3D View
                    </button>
                </>
            )}

            {/* Canvas for 3D Model */}
            <Canvas style={{ height: '100%', width: '100%' }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[0, 10, 5]} intensity={2.0} />
                <Suspense fallback={loadingPlaceholder}>
                    {/* Pass selectedTooth array, onTeethLoaded, and onMeshClick to Model */}
                    <MouthCanvas
                        selectedTooth={selectedTooth} // Pass the array
                        onMeshClick={handleMeshClick}
                        mouthData={mouthData}
                        is3d={is3DView}
                    />
                </Suspense>
                {/* Use these props to control the limits of the camera. */}
                <OrbitControls
                    ref={controlsRef}
                    enableZoom={true}
                    maxDistance={5}
                    minDistance={2}
                    enablePan={!is3DView}
                    minAzimuthAngle={-Math.PI / 2}
                    maxAzimuthAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2.75}
                    maxPolarAngle={Math.PI / 1.75}
                    dampingFactor={0.2}
                    enableRotate={is3DView}
                />
            </Canvas>
        </div>
    );
}

MouthManager.propTypes = {
    mouthData: PropTypes.object.isRequired,
    onToothSelected: PropTypes.func.isRequired
}