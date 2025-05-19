
import { useState, useEffect } from 'react';

const useTeethLayout = (patient) => {
  const [teethLayout, setTeethLayout] = useState([]);

  useEffect(() => {
    if (patient && patient.patientHistory && patient.patientHistory.length > 0) {
      setTeethLayout(patient.patientHistory[0].teethLayout || []);
    }
  }, [patient]);

  return [teethLayout, setTeethLayout];
};

export default useTeethLayout;
