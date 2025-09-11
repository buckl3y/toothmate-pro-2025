/*
    3D view of the mouth. Does not include any interface.
    Allows panning and scrolling of the model.
    Highlights teeth with treatments.

*/

import { Suspense, useState } from 'react'; // Import hooks
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PropTypes from 'prop-types'; // Import PropTypes


import MouthCanvas from './MouthCanvas';
import { useRef } from 'react';
import ChartOptions from './ChartOptions';


// The mouth viewer. Supports both 3D and grid layout.
export default function MouthManager({patient, onToothSelected}) {
    // Change state to hold an array of selected teeth
    const [selectedTooth, setselectedTooth] = useState();
    const [is3DView, setIs3DView] = useState(true);
    const controlsRef = useRef(); // Allows programatic control of camera.
    const [treatmentVisibility, setTreatmentVisibility] = useState({
        all: true,
        filling: true,
        crown: true,
        rootCanal: true,
        extraction: true,
        implant: true,
        veneer: true,
        sealant: true
    });
    const [showOptions, setShowOptions] = useState(true);
    const toggleOptions = () => setShowOptions(!showOptions);

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
        resetView();
    }

    function resetView() {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
        else {
            console.log("Unable to reset view. OrbitControls reference lost!");
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
        <div style={{ position: 'relative', height: '785px', width: '100%' }}>
            <div style={{height: '50%'}}>
                <Canvas 
                    key={is3DView ? '3d' : 'ortho'} // Force remount on view change
                    style={{ height: '100%', width: '100%' }}
                    orthographic={!is3DView}
                    camera={
                        // Orthographic view switching requires changes to camera position.
                        is3DView ? {
                            fov: 75
                        } : {
                            zoom: 13
                        }
                    }
                >
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[0, 10, 10]} intensity={2.0} />
                    <Suspense fallback={loadingPlaceholder}>
                        <MouthCanvas
                            selectedTooth={selectedTooth}
                            onMeshClick={handleMeshClick}
                            patient={patient}
                            treatmentVisibility={treatmentVisibility}
                            is3d={is3DView}
                        />
                    </Suspense>
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

            <div style={{height: '50%'}}>
                {showOptions ? (
                    <ChartOptions 
                        treatmentVisibility={treatmentVisibility}
                        setTreatmentVisibility={setTreatmentVisibility}
                        is3DView={is3DView}
                        handleViewChanged={handleViewChanged}
                        resetView={resetView}
                        toggleVisibility={toggleOptions}
                    />
                ) : (
                    <div style={{height: '100%'}}>
                        <p className='text-center' >Show Grid View Here</p>
                        <p className='text-center' onClick={toggleOptions}> ~  Display Options  ~ </p>
                    </div>
                )}
            </div>
        </div>
    );
}

MouthManager.propTypes = {
    mouthData: PropTypes.object.isRequired,
    onToothSelected: PropTypes.func.isRequired,
    patient: PropTypes.shape({
        nhiNumber: PropTypes.string.isRequired,
        Treatments: PropTypes.arrayOf(
            PropTypes.shape({
            date: PropTypes.string.isRequired,
            procedure: PropTypes.string,
            notes: PropTypes.string,
            tooth: PropTypes.string 
            })
        ).isRequired
        }).isRequired,
}