import { useState, startTransition } from 'react';
import PropTypes from 'prop-types';

import MouthManager from './Chart/MouthViewer/MouthManager';
import ToothCanvas from './Chart/ToothViewer/ToothCanvas';
import SurfaceSelector from './Chart/SurfaceSelector/SurfaceSelector';
import ToothTreatmentEditor from './ToothTreatmentEditor/ToothTreatmentEditor';
import useFetchPatients from '../../NavBar/FetchPatients';


export default function DentistView({selectedPatient, refreshPatientData }) {
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [selectedSurfaces, setSelectedSurfaces] = useState([]);
    const [showSurfaceSelector, setShowSurfaceSelector] = useState(true);
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const patients = useFetchPatients(serverUrl, () => {});

    const handleToothSelection = (Tooth) => {
        // Start transition prevents the app from crashing while it waits for the tooth viewer to load.
        startTransition(() => {
            setSelectedTooth(Tooth);
            console.log("Tooth " + Tooth + "was selected!")
        })
    }

    return (
        <div className="flex flex-row justify-center w-full gap-3">
            {selectedPatient ? (
                <div className={selectedTooth ? 
                        "grid grid-cols-5 grid-rows-6 gap-4 w-full " : 
                        "grid grid-cols-4 grid-rows-6 gap-4 w-full "}>
                    <div className="row-span-5 col-span-2 bg-white rounded-md">

                        <MouthManager
                            patient={selectedPatient}
                            onToothSelected={handleToothSelection}
                        />
                        
                    </div>  
                    
                    {selectedTooth && (
                        <div className={showSurfaceSelector ? 
                            "col-span-1 row-span-3 bg-white rounded-md" :
                            "col-span-1 row-span-5 bg-white rounded-md"
                            }>
                        
                            <h4 style={{textAlign: 'center', margin: '8px', fontWeight: 'bold'}}>
                                Tooth {selectedTooth.substring(2,5)}
                            </h4>
                            <ToothCanvas selectedTooth={selectedTooth} />

                        </div>
                    )}
                    
                    <div className="h-full col-span-2 row-span-5 bg-white rounded-md">

                        <div className="col-span-2 row-span-4 bg-white rounded-md h-full">
                            <ToothTreatmentEditor
                                selectedTooth={selectedTooth}
                                selectedSurfaces={selectedSurfaces}
                                selectedPatient={selectedPatient}
                                refreshPatientData={refreshPatientData}
                                setRequireSurface={setShowSurfaceSelector}
                            />
                        </div>

                    </div>

                    {(selectedTooth && showSurfaceSelector) && 
                        <div className='col-span-1 row-span-2 bg-white rounded-md h-full w-full'>
                            <SurfaceSelector 
                                selectedSurfaces={selectedSurfaces} 
                                setSelectedSurfaces={setSelectedSurfaces}
                                selectedTooth={selectedTooth} />
                        </div>
                    }
                    
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h2 className="text-4xl font-semibold mb-4 mt-5">Welcome</h2>
                    {patients.map(patient => (
                        <p key={patient.nhiNumber} id={patient.nhiNumber}>Hello {patient.name}</p>
                    ))}
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