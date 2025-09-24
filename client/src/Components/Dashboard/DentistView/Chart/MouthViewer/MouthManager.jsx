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

    const setToothSelection = (selection) => {
        setselectedTooth(selection);
        onToothSelected(selection);
    }

    // Select / Deselect teeth when clicked.
    const handleMeshClick = (meshName) => {
        if (selectedTooth == meshName) {
            setToothSelection(null);
        }
        else {
            setToothSelection(meshName);
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

    const getSelectedRowCol = (selectedTooth) => {
        return {
            row: selectedTooth[2], // t_[2]6
            col: selectedTooth[3]  // t_2[6]
        }
    }

    // Chart keyboard navigation
    const handleKeyPress = (event) => {
        const key = event.key;
        if (key === "Escape") { setToothSelection(null); return; }
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) { return; }
        if (selectedTooth == null) { setToothSelection("t_11"); return; }


        let row = getSelectedRowCol(selectedTooth).row;
        let col = getSelectedRowCol(selectedTooth).col;

        const decRow = () => {
            if (row > 1) { row-- }
            else {
                row = 4;
            }
        }

        const incRow = () => {
            if (row < 4) {
                row ++;
            } else {
                row = 1;
            }
        }

        const decCol = () => {
            if (col > 1) { col--; }
            else {
                decRow();
                col = 8;
            }
        }

        const incCol = () => {
            if (col < 8) { col++; }
            else {
                incRow();
                col = 1;
            }
        }

        if (key === "ArrowLeft") {
            decCol();
        }
        if (key === "ArrowUp") {
            decRow();
        }
        if (key === "ArrowDown") {
            incRow();
        }
        if (key === "ArrowRight") {
            incCol();
        }

        setToothSelection(`t_${row}${col}`);
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
        <div 
        onKeyDown={handleKeyPress}
        tabIndex={0} // Makes div focusable. Required to enable keypress capture.
        style={{ position: 'relative', height: '785px', width: '100%' }}>
            <div style={showOptions ? {height: '60%'} : {height: '95%'}}>
                <Canvas 
                    key={is3DView ? '3d' : 'ortho'} // Force remount on view change
                    style={{ height: '100%', width: '100%' }}
                    orthographic={!is3DView}
                    camera={
                        // Orthographic view switching requires changes to camera position.
                        is3DView ? {
                            fov: 80
                        } : {
                            zoom: 13
                        }
                    }
                >
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[0, 10, 10]} intensity={3.0} />
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
                        maxDistance={6}
                        minDistance={3}
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

            <div 
            style={showOptions? {height: '40%'} : {height: '5%'}}
            className='bottomcard'
            >
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
                        <p className='text-center' onClick={toggleOptions}> Chart View Options </p>
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