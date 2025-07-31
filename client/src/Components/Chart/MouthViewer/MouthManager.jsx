/*
    3D view of the mouth. Does not include any interface.
    Allows panning and scrolling of the model.
    Highlights teeth with treatments.

    authors:
        - Skye Pooley
            - Fetching and displaying tooth treatments.
        Jim Buchan 
            - Loading mouth 3D models into three.js

*/

import { Suspense, useState,  useCallback } from 'react'; // Import hooks
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import PropTypes from 'prop-types'; // Import PropTypes


import MouthCanvas from './MouthCanvas';
import { useRef, useEffect } from 'react';


// Component which holds the 3D model and handles interactions.
export default function MouthManager({mouthData, onToothSelected}) {
    // Change state to hold an array of selected teeth
    const [selectedTooth, setselectedTooth] = useState();
    const [is3DView, setIs3DView] = useState(true);

    // Callback for when a mesh is clicked in the Model component
    const handleMeshClick = (meshName) => {
        // Toggle selection: add if not present, remove if present
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
    }

    function loadingPlaceholder() {
        return (
            <>
                <h3>Loading Patient Chart...</h3>
            </>
        )
    }


    // Ref for OrbitControls
    const controlsRef = useRef();

    // Reset rotation when is3DView changes
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    }, [is3DView]);

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
                <OrbitControls
                    ref={controlsRef}
                    enableZoom={false}
                    enablePan={false}
                    enableDamping={false}
                    enableRotate={is3DView}
                />
                <OrthographicCamera />
            </Canvas>
        </div>
    );
}

MouthManager.propTypes = {
    mouthData: PropTypes.object.isRequired,
    onToothSelected: PropTypes.func.isRequired
}