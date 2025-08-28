// Effectively the entry point to the application.
// Everything happens here.

import { useState } from 'react';

import NavBar from '../NavBar/NavBar';
import AdminView from './AdminView/AdminView';
import DentistView from './DentistView/DentistView';
import PatientInformation from './DentistView/PatientInformation/PatientInformation';

import usePatientData from '../../hooks/usePatientData';

const Dashboard = () => {
    const [selectedPatientKey, setSelectedPatientKey] = useState(null);    
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

    const handlePatientUpdate = () => {
        console.log("Patient information component has updated patient details. Updating patient in dashboard.");
        refreshPatientData();
    }

    return (
        <div
            className="dashboard-container mx-auto p-5 w-full box-border flex flex-col gap-4"
            style={{ maxHeight: '100vh', overflowY: 'hidden', height: '98vh' }}
        >
            <NavBar
                selectedPatient={selectedPatient}
                onSelectPatient={(key, patient) => {
                    setSelectedPatientKey(key);
                    handlePatientSelect(patient);
                }}
                onPatientUpdate={(updatedPatient) => setSelectedPatient(updatedPatient)}
                onToggleView={setIsAdminView}
            />
            {selectedPatient && (
                <PatientInformation patient={selectedPatient} onUpdate={handlePatientUpdate} />
            )}
            <div>
                {isAdminView ? (
                    <AdminView />
                ) : (
                    <DentistView 
                        selectedPatient={selectedPatient} 
                        refreshPatientData={refreshPatientData} 
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
