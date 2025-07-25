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
import { OrbitControls } from '@react-three/drei';
import { getPatientMouthData } from '../../../api/MouthApi';
import PropTypes from 'prop-types'; // Import PropTypes


import MouthCanvas from './MouthCanvas';


// Component which holds the 3D model and handles interactions.
export default function MouthManager({mouthData, onToothSelected}) {
    // Change state to hold an array of selected teeth
    const [selectedTooth, setselectedTooth] = useState();
    const [availableTeeth, setAvailableTeeth] = useState([]); // State for teeth names from model

    // Callback function to receive mesh names from the Model component
    const handleTeethLoaded = useCallback((meshNames) => {
        console.log("DisplayWholeMouth: Received mesh names:", meshNames); // Log received names
        setAvailableTeeth(meshNames);
    }, []); // Empty dependency array means this function is run once

    // Callback for when a mesh is clicked in the Model component
    const handleMeshClick = (meshName) => {
        // Disallow selection of the jaws
        if (meshName == "upper_jaw" || meshName == "lower_jaw") {
            return;
        }

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

    // Callback for clicking the canvas background
    // This is super broken. Only the fallback case is ever triggered.
    const handleCanvasClick = (event) => {
        // Simplified check to avoid error: Check if the direct target is the canvas itself
        if (event.target.localname == "canvas") {
            console.log("Canvas background clicked. Selection remains unchanged.");
            // This case is never triggered. Not sure why.
        } else if (event.intersections?.length > 0) {
            // This case is handled by onPointerDown in Model due to event propagation stopping
            console.log("Canvas click detected on an object. Selection handled by mesh click.");
        } else {
            // Fallback log for unexpected event structure
            console.log("Canvas click detected, but event structure is unexpected.", event);
        }
    };

    function loadingPlaceholder() {
        return (
            <>
                <h3>Loading Patient Chart...</h3>
            </>
        )
    }


    return (
        <div style={{ position: 'relative', height: '800px', width: '100%' }}>

            {/* Canvas for 3D Model */}
            <Canvas style={{ height: '100%', width: '100%' }} onClick={handleCanvasClick}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[0, 10, 5]} intensity={2.0} />
                <Suspense fallback={loadingPlaceholder}>
                    {/* Pass selectedTooth array, onTeethLoaded, and onMeshClick to Model */}
                    <MouthCanvas
                        selectedTooth={selectedTooth} // Pass the array
                        onTeethLoaded={handleTeethLoaded}
                        onMeshClick={handleMeshClick}
                        mouthData={mouthData}
                    />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} enableDamping={false}/>
            </Canvas>
        </div>
    );
}

MouthManager.propTypes = {
    mouthData: PropTypes.object.isRequired,
    onToothSelected: PropTypes.func.isRequired
}