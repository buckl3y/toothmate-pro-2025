// src/components/Dashboard/Dashboard.jsx


import { useState, useEffect } from 'react';
import PatientInformation from '../PatientInformation/PatientInformation';
import Notes from '../Notes/Notes';
import PatientHistory from '../PatientHistory/PatientHistory';
import XrayHistory from '../XrayHistory/XrayHistory';
import TeethView from '../Chart/DisplayWholeMouth';
import NavBar from '../NavBar/NavBar';
import TreatmentPlan from '../TreatmentPlan/TreatmentPlan';
import AdminView from '../AdminView/AdminView';
import usePatientData from '../../hooks/usePatientData';
import useTeethLayout from '../../hooks/useTeethLayout';

const Dashboard = () => {
    const [selectedPatientKey, setSelectedPatientKey] = useState(null);
    const [selectedNote, setSelectedNote] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [note, setNote] = useState('');
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [isAdminView, setIsAdminView] = useState(false);
    const [toothTreatments, setToothTreatments] = useState({});

    const {
        patient: selectedPatient,
        setPatient: setSelectedPatient,
        refreshPatientData,
    } = usePatientData(selectedPatientKey);

    const [teethLayout, setTeethLayout] = useTeethLayout(selectedPatient, selectedDate);

    // const handleToothAdd = (toothName) => {
    //     if (!selectedPatient) return;

    //     const exists = teethLayout.some((row) =>
    //         row.some((tooth) => tooth && tooth.includes(`${toothName}.glb`))
    //     );

    //     if (exists) {
    //         setMessage(`Tooth ${toothName} already exists in the layout.`);
    //         return;
    //     }

    //     let rowIndex = -1;
    //     let colIndex = -1;
    //     let toothUrl = '';

    //     templates.mixedView.forEach((row, rIndex) => {
    //         row.forEach((url, cIndex) => {
    //             const name = url.split('/').pop().replace('.glb', '');
    //             if (name === toothName) {
    //                 rowIndex = rIndex;
    //                 colIndex = cIndex;
    //                 toothUrl = url;
    //             }
    //         });
    //     });

    //     if (rowIndex === -1 || colIndex === -1) {
    //         setMessage(`Tooth ${toothName} not found in templates.`);
    //         return;
    //     }

    //     const updatedLayout = cloneDeep(teethLayout);
    //     updatedLayout[rowIndex][colIndex] = toothUrl;

    //     setTeethLayout(updatedLayout);
    //     setMessage(`Tooth ${toothName} added successfully.`);
    //     setTimeout(clearMessage, 2000);
    // };

    // const handleToothRemove = (toothName) => {
    //     if (!selectedPatient) return;

    //     let rowIndex = -1;
    //     let colIndex = -1;

    //     templates.mixedView.forEach((row, rIndex) => {
    //         row.forEach((toothUrl, cIndex) => {
    //             const name = toothUrl.split('/').pop().replace('.glb', '');
    //             if (name === toothName) {
    //                 rowIndex = rIndex;
    //                 colIndex = cIndex;
    //             }
    //         });
    //     });

    //     if (rowIndex === -1 || colIndex === -1) {
    //         setMessage(`Tooth ${toothName} not found in templates.`);
    //         return;
    //     }

    //     const updatedLayout = cloneDeep(teethLayout);
    //     updatedLayout[rowIndex][colIndex] = null;

    //     setTeethLayout(updatedLayout);
    //     setMessage(`Tooth ${toothName} removed successfully.`);
    //     setTimeout(clearMessage, 2000);
    // };

    const handleNoteUpdate = (updatedNote) => {
        setNote(updatedNote);
        setSelectedNote(updatedNote);
    };

    const handleSelectNote = (note, date, layout) => {
        setSelectedNote(note);
        setNote(note);
        setSelectedDate(date);
        setTeethLayout(layout);
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
                        <div className="grid grid-cols-5 grid-rows-5 gap-4 w-full">
                            <div className="row-span-3 col-span-2 bg-white rounded-md">
                                <TeethView
                                    view={teethLayout}
                                    toothTreatments={toothTreatments}
                                    onToothSelect={setSelectedTooth}
                                />
                            </div>  
                            <div className="col-span-1 row-span-3 bg-white rounded-md">
                                <h3>Single Tooth Viewer</h3>
                            </div>  
                            <div className="col-span-2 row-span-3 bg-white rounded-md">
                                {selectedTooth ? (
                                    <TreatmentPlan
                                        toothUrl={selectedTooth}
                                        patient={selectedPatient}
                                        selectedDate={selectedDate}
                                        onClose={() => setSelectedTooth(null)}
                                        onUpdatePatient={setSelectedPatient}
                                    />
                                ) : (
                                    <p>Select a Tooth to Edit</p>
                                )}
                            </div>
                            <div className='col-span-2 row-span-2 bg-white rounded-md'>
                                <PatientHistory
                                    patient={selectedPatient}
                                    onSelectNote={handleSelectNote}
                                    onPatientUpdate={handlePatientUpdate}
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
