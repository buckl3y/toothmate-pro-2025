// src/components/Dashboard/Dashboard.jsx

import { useState, useEffect } from 'react';
import PatientInformation from '../PatientInformation/PatientInformation';
import Notes from '../Notes/Notes';
import PatientHistory from '../PatientHistory/PatientHistory';
import XrayHistory from '../XrayHistory/XrayHistory';
import TeethView from '../Chart/DisplayWholeMouth';
import NavBar from '../NavBar/NavBar';
import AddToothButton from '../Chart/addToothButton';
import RemoveToothButton from '../Chart/removeToothButton';
import templates from '../data/templates';
import TreatmentPlan from '../TreatmentPlan/TreatmentPlan';
import AdminView from '../AdminView/AdminView';
import usePatientData from '../../hooks/usePatientData';
import useTeethLayout from '../../hooks/useTeethLayout';
import { cloneDeep } from 'lodash';

const Dashboard = () => {
    const [selectedPatientKey, setSelectedPatientKey] = useState(null);
    const [selectedNote, setSelectedNote] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [isAdminView, setIsAdminView] = useState(false);
    const [toothTreatments, setToothTreatments] = useState({});

    const {
        patient: selectedPatient,
        setPatient: setSelectedPatient,
        refreshPatientData,
    } = usePatientData(selectedPatientKey);

    const [teethLayout, setTeethLayout] = useTeethLayout(selectedPatient, selectedDate);

    const clearMessage = () => {
        setMessage('');
    };

    const handleToothAdd = (toothName) => {
        if (!selectedPatient) return;

        const exists = teethLayout.some((row) =>
            row.some((tooth) => tooth && tooth.includes(`${toothName}.glb`))
        );

        if (exists) {
            setMessage(`Tooth ${toothName} already exists in the layout.`);
            return;
        }

        let rowIndex = -1;
        let colIndex = -1;
        let toothUrl = '';

        templates.mixedView.forEach((row, rIndex) => {
            row.forEach((url, cIndex) => {
                const name = url.split('/').pop().replace('.glb', '');
                if (name === toothName) {
                    rowIndex = rIndex;
                    colIndex = cIndex;
                    toothUrl = url;
                }
            });
        });

        if (rowIndex === -1 || colIndex === -1) {
            setMessage(`Tooth ${toothName} not found in templates.`);
            return;
        }

        const updatedLayout = cloneDeep(teethLayout);
        updatedLayout[rowIndex][colIndex] = toothUrl;

        setTeethLayout(updatedLayout);
        setMessage(`Tooth ${toothName} added successfully.`);
        setTimeout(clearMessage, 2000);
    };

    const handleToothRemove = (toothName) => {
        if (!selectedPatient) return;

        let rowIndex = -1;
        let colIndex = -1;

        templates.mixedView.forEach((row, rIndex) => {
            row.forEach((toothUrl, cIndex) => {
                const name = toothUrl.split('/').pop().replace('.glb', '');
                if (name === toothName) {
                    rowIndex = rIndex;
                    colIndex = cIndex;
                }
            });
        });

        if (rowIndex === -1 || colIndex === -1) {
            setMessage(`Tooth ${toothName} not found in templates.`);
            return;
        }

        const updatedLayout = cloneDeep(teethLayout);
        updatedLayout[rowIndex][colIndex] = null;

        setTeethLayout(updatedLayout);
        setMessage(`Tooth ${toothName} removed successfully.`);
        setTimeout(clearMessage, 2000);
    };

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

    const handleToggleView = (isAdmin) => {
        setIsAdminView(isAdmin);
    };

    return (
        <div className="dashboard-container mx-auto p-5 h-screen w-5/6 box-border flex flex-col gap-4">
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
                        <div className="flex flex-row justify-center h-full w-full gap-4">
                            <div className="flex flex-col h-full w-3/4 gap-4 align-center justify-between">
                                <div className="bg-white h-full rounded-2xl relative">
                                    {selectedTooth ? (
                                        <TreatmentPlan
                                            toothUrl={selectedTooth}
                                            patient={selectedPatient}
                                            selectedDate={selectedDate}
                                            onClose={() => setSelectedTooth(null)}
                                            onUpdatePatient={setSelectedPatient}
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute top-5 left-5 z-50 flex flex-row gap-2">
                                                <AddToothButton
                                                    onToothSelect={handleToothAdd}
                                                    currentLayout={teethLayout}
                                                />
                                                <RemoveToothButton
                                                    onToothRemove={handleToothRemove}
                                                    currentLayout={teethLayout}
                                                />
                                                {message && <div className="mt-2 text-red-500">{message}</div>}
                                            </div>
                                            <TeethView
                                                view={teethLayout}
                                                toothTreatments={toothTreatments}
                                                onToothSelect={setSelectedTooth}
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-row gap-4 items-center">
                                    <PatientInformation patient={selectedPatient} onUpdate={handlePatientUpdate} />
                                    <Notes
                                        nhi={selectedPatientKey}
                                        date={selectedDate}
                                        note={note}
                                        onUpdate={handleNoteUpdate}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-1/4">
                                <div className="flex flex-col h-full justify-center gap-6">
                                    <PatientHistory
                                        patient={selectedPatient}
                                        onSelectNote={handleSelectNote}
                                        onPatientUpdate={handlePatientUpdate}
                                        currentTeethLayout={teethLayout}
                                    />
                                    <XrayHistory
                                        patient={selectedPatient}
                                        refreshPatientData={refreshPatientData}
                                    />
                                </div>
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
            )}
        </div>
    );
};

export default Dashboard;
