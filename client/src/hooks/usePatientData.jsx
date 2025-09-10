
import { useState, useEffect } from 'react';
import { getPatientById } from '../api';

const usePatientData = (patientId) => {
  console.log("usePatientData hook called with id: " + patientId);
  const [patient, setPatient] = useState(patientId);

  useEffect(() => {

    if (patientId) {
      const fetchPatientData = async () => {
        try {
          const response = await getPatientById(patientId);
          setPatient(response.data);
        } catch (error) {
          console.error('Error fetching patient data:', error);
        }
      };
      fetchPatientData();
    }
    console.log("Refreshed patient data...");
  }, [patientId]);

  const refreshPatientData = async () => {
    console.log("Refreshing patient data in usePatientData hook")
    if (patientId) {
      try {
        const response = await getPatientById(patientId);
        setPatient(response.data);
      } catch (error) {
        console.error('Error refreshing patient data:', error);
      }
    }
  };

  return { patient, setPatient, refreshPatientData };
};

export default usePatientData;
