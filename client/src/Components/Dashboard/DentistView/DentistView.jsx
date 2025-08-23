import { useState, startTransition } from 'react';
import PropTypes from 'prop-types';

import XrayHistory from './XrayHistory/XrayHistory';

import MouthManager from './Chart/MouthViewer/MouthManager';
import ToothCanvas from './Chart/ToothViewer/ToothCanvas';
import SurfaceSelector from './Chart/SurfaceSelector/SurfaceSelector';
import ToothTreatmentEditor from './ToothTreatmentEditor/ToothTreatmentEditor';


export default function DentistView({selectedPatient, refreshPatientData, selectedDate}) {
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [selectedSurface, setSelectedSurface] = useState(null);

    const handleToothSelection = (Tooth) => {
        // Start transition prevents the app from crashing while it waits for the tooth viewer to load.
        startTransition(() => {
            setSelectedTooth(Tooth);
            console.log("Tooth " + Tooth + "was selected!")
        })
    }

    const handleSurfaceSelection = (surface) => {
        console.log(surface);
        setSelectedSurface(surface);
    }

    return (
        <div className="flex flex-row justify-center h-full w-full gap-3">
            {selectedPatient ? (
                <div className="grid grid-cols-5 grid-rows-6 gap-4 w-full">
                    <div className="row-span-4 col-span-2 bg-white rounded-md">

                        <MouthManager
                            patient={selectedPatient}
                            onToothSelected={handleToothSelection}
                        />
                        
                    </div>  
                    <div className="col-span-1 row-span-2 bg-white rounded-md">
                        {selectedTooth ? (
                            <div>
                                <h3 style={{textAlign: 'center', margin: '8px', fontWeight: 'bold'}}>
                                    Selected Tooth: {selectedTooth}
                                </h3>
                                <ToothCanvas selectedTooth={selectedTooth} />
                            </div>
                            
                        ) : (
                            <h3 style={{textAlign: 'center', margin: '8px', fontWeight: 'bold'}}>
                                Select a Tooth to View
                            </h3>
                        )}
                    </div>  
                    
                    <div className="col-span-2 row-span-4 bg-white rounded-md">
                        {selectedTooth ? (
                                <div className="col-span-2 row-span-4 bg-white rounded-md h-full">
                                    <ToothTreatmentEditor
                                        selectedTooth={selectedTooth}
                                        selectedSurface={selectedSurface}
                                        selectedPatient={selectedPatient}
                                        refreshPatientData={refreshPatientData}
                                        selectedDate={selectedDate}
                                    />
                                </div>
                        ) : (
                            <h3 style={{textAlign: 'center', margin: '8px', fontWeight: 'bold'}}>
                                Select a tooth to edit.
                            </h3>
                        )}
                    </div>
                    <div className='col-span-1 row-span-2 bg-white rounded-md h-full w-full'>
                        <SurfaceSelector onSurfaceSelected={handleSurfaceSelection}/>
                    </div>
                    <div className='col-span-2 row-span-2 bg-white rounded-md'>
                        <XrayHistory
                            patient={selectedPatient}
                            refreshPatientData={refreshPatientData}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h2 className="text-4xl font-semibold mb-4">No Patient Selected</h2>
                    <p className="text-white text-2xl">
                        Please select a patient from the navigation bar to view their information.
                    </p>
                </div>
            )}
        </div>
    )
}

DentistView.propTypes = {
    selectedPatient: PropTypes.shape({
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
      refreshPatientData: PropTypes.func.isRequired,
}