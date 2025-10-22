/** Effectively the entry point to the application.
 *  Everything happens here.
 * 
 *  @author Skye Pooley
 */

import { useState } from 'react';

import NavBar from '../NavBar/NavBar';
import DentistView from './DentistView/DentistView';
import PatientInformation from './DentistView/PatientInformation/PatientInformation';
import useFetchPatients from '../NavBar/FetchPatients';
import usePatientData from '../../hooks/usePatientData';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
    const passedNhi = useParams().nhi;
    console.log("passed nhi number: " + passedNhi);
    const [selectedPatientKey, setSelectedPatientKey] = useState(null);

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

    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const patientsList = useFetchPatients(serverUrl, refreshPatientData);
    useEffect(() => {
        if (passedNhi && patientsList) {
            const matchedPatient = patientsList.find(patient => patient.nhiNumber === passedNhi);
            if (matchedPatient) {
                setSelectedPatientKey(matchedPatient.nhiNumber);
                handlePatientSelect(matchedPatient);
            }
        }
    }, [passedNhi, patientsList])
    

    return (
        <div
            className="dashboard-container mx-auto p-3 w-full box-border flex flex-col gap-4"
            style={{ maxHeight: '100vh', overflowY: 'hidden', height: '98vh' }}
        >
            <NavBar
                selectedPatient={selectedPatient}
                onSelectPatient={(key, patient) => {
                    setSelectedPatientKey(key);
                    handlePatientSelect(patient);
                }}
                onPatientUpdate={(updatedPatient) => setSelectedPatient(updatedPatient)}
                onToggleView={() => {}} // Admin view is not implemented so don't switch to it.
            />
            {selectedPatient && (
                <PatientInformation patient={selectedPatient} onUpdate={handlePatientUpdate} />
            )}
            <div>
                <DentistView 
                    selectedPatient={selectedPatient} 
                    refreshPatientData={refreshPatientData} 
                />
            </div>
        </div>
    );
};

export default Dashboard;
