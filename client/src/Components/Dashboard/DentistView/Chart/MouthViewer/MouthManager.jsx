/*
    3D view of the mouth. Does not include any interface.
    Allows panning and scrolling of the model.
    Highlights teeth with treatments.

*/


import PropTypes from 'prop-types'; // Import PropTypes


import MouthViewer from './MouthViewer';
import { useState } from 'react';
import ChartOptions from './ChartOptions';


// The mouth viewer. Supports both 3D and grid layout.
export default function MouthManager({patient, onToothSelected}) {
    const [is3DView, setIs3DView] = useState(true);
    // Change state to hold an array of selected teeth
    
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
    const [showOptions, setShowOptions] = useState(false);
    const toggleOptions = () => setShowOptions(!showOptions);

    const onSelectionChanged = (selection) => {
        console.log(selection);
        setSelectedTooth(selection)
    }

    const [selectedTooth, setSelectedTooth] = useState();


    return (
        <div style={{ position: 'relative', height: '785px', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{height: '50%'}}>
                <MouthViewer 
                    key={`mouth-viewer-upper-${is3DView ? '3d' : 'ortho'}`}
                    patient={patient}
                    onToothSelected={onToothSelected}
                    is3DView={is3DView}
                    treatmentVisibility={treatmentVisibility}
                    selectedTooth={selectedTooth}
                    setSelectedTooth={onSelectionChanged}
                />
            </div>

            <div style={{height: '50%', backgroundColor: '#EEE'}}>
                {showOptions && (
                    <ChartOptions 
                        treatmentVisibility={treatmentVisibility}
                        setTreatmentVisibility={setTreatmentVisibility}
                        is3DView={is3DView}
                        handleViewChanged={setIs3DView}
                        resetView={() => {}}
                        toggleVisibility={toggleOptions}
                    />
                )}
                <div style={{height: '100%'}}>
                    <MouthViewer 
                        key={`mouth-viewer-lower-${is3DView ? '3d' : 'ortho'}`}
                        patient={patient}
                        onToothSelected={onToothSelected}
                        is3DView={!is3DView}
                        treatmentVisibility={treatmentVisibility}
                        selectedTooth={selectedTooth}
                        setSelectedTooth={onSelectionChanged}
                    />
                    <p className='text-center' onClick={toggleOptions}> ~  Display Options  ~ </p>
                </div>
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