// Effectively the entry point to the application.
// Everything happens here.

import { useState, useEffect } from 'react';

import NavBar from '../NavBar/NavBar';
import AdminView from './AdminView/AdminView';
import DentistView from './DentistView/DentistView';

import usePatientData from '../../hooks/usePatientData';



const Dashboard = () => {
    const [selectedPatientKey, setSelectedPatientKey] = useState(null);
    const [selectedDate, setSelectedDate] = useState(Date.now().Date);
    
    const [isAdminView, setIsAdminView] = useState(false);

    const {
        patient: selectedPatient,
        setPatient: setSelectedPatient,
        refreshPatientData,
    } = usePatientData(selectedPatientKey);

    const handlePatientSelect = (patient) => {
        console.log("NavBar returned patient to dashboard: \n" + JSON.stringify(patient));
        setSelectedPatient(patient);
    }

    // When patient loaded / changed
    useEffect(() => {
    console.log("Patient change detected in dashboard: " + JSON.stringify(selectedPatient))

    }, [selectedPatient, selectedDate]);

    return (
        <div className="dashboard-container mx-auto p-5 h-screen w-full box-border flex flex-col gap-4">
            <NavBar
                selectedPatient={selectedPatient}
                onSelectPatient={(key, patient) => {
                    setSelectedPatientKey(key);
                    handlePatientSelect(patient);
                }}
                onPatientUpdate={(updatedPatient) => setSelectedPatient(updatedPatient)}
                onToggleView={setIsAdminView}
            />
            {isAdminView ? (
                <AdminView />
            ) : (
                <DentistView 
                    selectedPatient={selectedPatient} 
                    refreshPatientData={refreshPatientData} 
                    selectedDate={selectedDate}
                />
            )}
        </div>
    );
};

export default Dashboard;
