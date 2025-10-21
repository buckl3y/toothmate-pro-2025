import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL;
console.log('API Server URL:', import.meta.env.VITE_SERVER_URL);

// Patient APIs
export const getPatientById = async (patientId) => {
  return axios.get(`${serverUrl}/api/patient/${patientId}`);
};

export const updatePatient = async (patient) => {
  return axios.post(`${serverUrl}/api/update-patient`, { patient });
};

// Notes APIs
export const updateNotes = async (nhi, date, notes) => {
  return axios.post(`${serverUrl}/api/update-notes`, {
    nhi,
    date,
    notes,
  });
};

// Caution APIs
export const updateCaution = async (nhi, caution) => {
  return axios.post(`${serverUrl}/api/update-caution`, {
    nhi,
    caution,
  });
};

// History APIs
export const addHistoryEntry = async (patient) => {
  return axios.post(`${serverUrl}/api/update-patient`, { patient });
};

// X-ray APIs
export const uploadXray = async (formData) => {
  return axios.post(`${serverUrl}/api/upload-xray`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteXray = async (patientId, fileName) => {
  return axios.post(`${serverUrl}/api/delete-xray`, {
    patientId,
    fileName,
  });
};

// Treatment APIs
export const deleteTreatment = async (treatmentId) => {
  return axios.delete(`${serverUrl}/api/delete-treatment/${treatmentId}`);
};

// Condition APIs
export const deleteCondition = async (conditionId) => {
  return axios.delete(`${serverUrl}/api/delete-condition/${conditionId}`);
};

export const checkXrayFilename = async (patientId, fileName) => {
  return axios.get(`${serverUrl}/api/check-xray-filename/${patientId}/${fileName}`);
};

export const addTreatment = async (patient, treatment) => {
  return axios.post(`${serverUrl}/api/add-treatment`, 
    {
      patient: patient,
      treatment: treatment
    }
  );
}

export const addCondition = async (patient, condition) => {
  return axios.post(`${serverUrl}/api/add-condition`,
    {
      patient: patient,
      condition: condition
    }
  )
}