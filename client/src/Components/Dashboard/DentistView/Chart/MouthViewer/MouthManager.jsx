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
import { OrbitControls } from '@react-three/drei';
import PropTypes from 'prop-types'; // Import PropTypes


import MouthCanvas from './MouthCanvas';
import { useRef } from 'react';


// The mouth viewer. Supports both 3D and grid layout.
export default function MouthManager({patient, onToothSelected}) {
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

    const [menuCollapsed, setMenuCollapsed] = useState(true);
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

    return (
        <div style={{ position: 'relative', height: '800px', width: '100%' }}>
            {/* Treatment Options */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    background: '#fff',
                    padding: menuCollapsed ? '6px' : '12px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    
                    transition: 'min-width 0.2s, padding 0.2s'
                }}
            >
                <button
                    className="btn-secondary"
                    style={{ marginBottom: '4px', fontSize: '12pt', fontWeight: "bold" }}
                    onClick={() => setMenuCollapsed((prev) => !prev)}
                >
                    {menuCollapsed ? '> Show Options' : '< Hide Options'}
                </button>
                {!menuCollapsed && (
                    <>
                        <br />
                        {is3DView ? (
                            <button id="view-change-button" className='btn' onClick={() => handleViewChanged(!is3DView)}>
                                3D Mouth
                            </button>
                        ) : (
                            <button id="view-change-button" className='btn-secondary' onClick={() => handleViewChanged(!is3DView)}>
                                3D Mouth
                            </button>
                        )}
                        <button id='camera-reset-button' className='btn-secondary' onClick={() => resetView()}>To Front</button>

                        <h4>Show:</h4>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="checkbox" 
                                style={{ marginRight: 6 }} 
                                onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, all: e.target.checked}})} 
                                checked={treatmentVisibility.all} 
                            />
                            Treatments:
                        </label>
                        {treatmentVisibility.all && (
                            <>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ background: "#C00A0A" }} className='legend-colour' />
                                    <input 
                                        type="checkbox" 
                                        style={{ marginRight: 6 }} 
                                        onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, filling: e.target.checked}})} 
                                        checked={treatmentVisibility.filling} 
                                    />
                                    Fillings
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ background: "#FF5100" }} className='legend-colour' />
                                    <input 
                                        type="checkbox" 
                                        style={{ marginRight: 6 }} 
                                        onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, crown: e.target.checked}})} 
                                        checked={treatmentVisibility.crown} 
                                    />
                                    Crowns
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ background: "#0080FF" }} className='legend-colour' />
                                    <input 
                                        type="checkbox" 
                                        style={{ marginRight: 6 }} 
                                        onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, rootCanal: e.target.checked}})} 
                                        checked={treatmentVisibility.rootCanal} 
                                    />
                                    Root Canals
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ background: "#EEEEEE", borderColor: "black", borderWidth: "2px" }} className='legend-colour' />
                                    <input 
                                        type="checkbox" 
                                        style={{ marginRight: 6 }} 
                                        onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, extraction: e.target.checked}})} 
                                        checked={treatmentVisibility.extraction} 
                                    />
                                    Extractions
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ background: "#007610" }} className='legend-colour' />
                                    <input 
                                        type="checkbox" 
                                        style={{ marginRight: 6 }} 
                                        onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, implant: e.target.checked}})} 
                                        checked={treatmentVisibility.implant} 
                                    />
                                    Implants
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ background: "#7B00FF" }} className='legend-colour' />
                                    <input 
                                        type="checkbox" 
                                        style={{ marginRight: 6 }} 
                                        onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, veneer: e.target.checked}})} 
                                        checked={treatmentVisibility.veneer} 
                                    />
                                    Veneers
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ background: "#FF0099" }} className='legend-colour' />
                                    <input 
                                        type="checkbox" 
                                        style={{ marginRight: 6 }} 
                                        onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, sealant: e.target.checked}})} 
                                        checked={treatmentVisibility.sealant} 
                                    />
                                    Sealant
                                </label>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Canvas for 3D Model */}
            <Canvas style={{ height: '100%', width: '100%' }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[0, 10, 5]} intensity={2.0} />
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
    );
}

MouthManager.propTypes = {
    mouthData: PropTypes.object.isRequired,
    onToothSelected: PropTypes.func.isRequired
}