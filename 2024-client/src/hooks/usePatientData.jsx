
import { useState, useEffect } from 'react';
import { getPatientById } from '../api';

const usePatientData = (patientId) => {
  const [patient, setPatient] = useState(null);

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
  }, [patientId]);

  const refreshPatientData = async () => {
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
