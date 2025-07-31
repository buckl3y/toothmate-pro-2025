// src/components/Dashboard/Dashboard.jsx


import { useState, useEffect, startTransition } from 'react';
import PatientInformation from '../PatientInformation/PatientInformation';
import NavBar from '../NavBar/NavBar';
// import Notes from '../Notes/Notes';
import AdminView from '../AdminView/AdminView';
import MouthManager from '../Chart/MouthViewer/MouthManager';
import ToothCanvas from '../Chart/ToothViewer/ToothCanvas';
import SurfaceSelector from '../Chart/SurfaceSelector/SurfaceSelector';

import PatientHistory from '../PatientHistory/PatientHistory';
import XrayHistory from '../XrayHistory/XrayHistory';
import TreatmentPlan from '../TreatmentPlan/TreatmentPlan';
import usePatientData from '../../hooks/usePatientData';
import useTeethLayout from '../../hooks/useTeethLayout';
import { getPatientMouthData } from '../../api/MouthApi';

const mouthData = await getPatientMouthData("NH123");

const Dashboard = () => {
    const [selectedPatientKey, setSelectedPatientKey] = useState(null);
    const [selectedNote, setSelectedNote] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [note, setNote] = useState('');
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [isAdminView, setIsAdminView] = useState(false);
    const [toothTreatments, setToothTreatments] = useState({});
    const [is3DView, setIs3DView] = useState(true);

    const {
        patient: selectedPatient,
        setPatient: setSelectedPatient,
        refreshPatientData,
    } = usePatientData(selectedPatientKey);

    const [teethLayout, setTeethLayout] = useTeethLayout(selectedPatient, selectedDate);

    const handleNoteUpdate = (updatedNote) => {
        setNote(updatedNote);
        setSelectedNote(updatedNote);
    };

    const handleSelectNote = (note, date, layout) => {
        setSelectedNote(note);
        setNote(note);
        setSelectedDate(date);
    };

    // When patient loaded / changed
    useEffect(() => {
      if (selectedPatient && selectedDate) {
        const historyEntry = selectedPatient.patientHistory.find(
          (entry) => entry.date === selectedDate
        );
        if (historyEntry) {
          setToothTreatments(historyEntry.toothTreatments || {});
        } else {
          setToothTreatments({});
        }
      }
    }, [selectedPatient, selectedDate]);

    const handlePatientUpdate = (updatedPatient) => {
        setSelectedPatient(updatedPatient);
    };

    // Go to admin / dentist view
    const handleToggleView = (isAdmin) => {
        setIsAdminView(isAdmin);
    };

    const handleToothSelection = (Tooth) => {
        // Start transition prevents the app from crashing while it waits for the tooth viewer to load.
        startTransition(() => {
            setSelectedTooth(Tooth);
            console.log("Tooth " + Tooth + "was selected!")
        })
    }

    const handleSurfaceSelection = (surface) => {
        console.log(surface);
    }

    return (
        <div className="dashboard-container mx-auto p-5 h-screen w-full box-border flex flex-col gap-4">
            <NavBar
                selectedPatient={selectedPatient}
                onSelectPatient={(key, patient) => {
                    setSelectedPatientKey(key);
                    setSelectedPatient(patient);
                }}
                onPatientUpdate={(updatedPatient) => setSelectedPatient(updatedPatient)}
                onToggleView={handleToggleView}
            />
            {isAdminView ? (
                <AdminView />
            ) : (
                <div className="flex flex-row justify-center h-full w-full gap-3">
                    {selectedPatient ? (
                        <div className="grid grid-cols-5 grid-rows-6 gap-4 w-full">
                            <div className="row-span-4 col-span-2 bg-white rounded-md">

                                <MouthManager
                                    mouthData={mouthData}
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
                                    <>
                                        <h3 style={{textAlign: 'center', margin: '8px', fontWeight: 'bold'}}>
                                            Tooth Selected: {selectedTooth}
                                        </h3>
                                        {/* <TreatmentPlan
                                            toothUrl={selectedTooth}
                                            patient={selectedPatient}
                                            selectedDate={selectedDate}
                                            onClose={() => setSelectedTooth(null)}
                                            onUpdatePatient={setSelectedPatient}
                                        /> */}
                                    </>
                                ) : (
                                    <h3 style={{textAlign: 'center', margin: '8px', fontWeight: 'bold'}}>
                                        Tooth Editor Placeholder
                                    </h3>
                                )}
                            </div>
                            <div className='col-span-1 row-span-2 bg-white rounded-md h-full w-full'>
                                <SurfaceSelector onSurfaceSelected={handleSurfaceSelection}/>
                            </div>
                            <div className='col-span-2 row-span-2 bg-white rounded-md'>
                                <PatientHistory
                                    patient={selectedPatient}
                                    onSelectNote={handleSelectNote}
                                    // onPatientUpdate={handlePatientUpdate}
                                    currentTeethLayout={teethLayout}
                                />
                            </div>
                            <div className='col-span-2 row-span-2 bg-white rounded-md'>
                                <XrayHistory
                                    patient={selectedPatient}
                                    refreshPatientData={refreshPatientData}
                                />
                            </div>
                            <div className='col-span-1 row-span-2 bg-white rounded-md'>
                                <PatientInformation patient={selectedPatient} onUpdate={handlePatientUpdate} />
                            </div>

                            {/* <Notes
                                    nhi={selectedPatientKey}
                                    date={selectedDate}
                                    note={note}
                                    onUpdate={handleNoteUpdate}
                                /> */}
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
            )}
        </div>
    );
};

export default Dashboard;
