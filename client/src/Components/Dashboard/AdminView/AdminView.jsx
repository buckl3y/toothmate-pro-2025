
import { useState } from 'react';
import AdminSearch from './_components/AdminSearch';
import PatientDetails from './_components/PatientDetails';
import { getPatientById, updatePatient } from '../../../api';

const AdminView = () => {
  const [nhiSearchTerm, setNhiSearchTerm] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await getPatientById(nhiSearchTerm);
      const data = response.data;

      // Ensure caution fields are initialized
      data.caution = {
        allergies: data.caution?.allergies || [],
        medicalConditions: data.caution?.medicalConditions || [],
        medication: data.caution?.medication || [],
        patientPreferences: data.caution?.patientPreferences || [],
      };

      setPatientData(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      alert('Patient not found');
    }
  };

  const handleSave = async () => {
    try {
      await updatePatient(patientData);
      alert('Patient information updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating patient data:', error);
      alert('Failed to update patient information');
    }
  };

  return (
    <div className="p-6">
      <AdminSearch
        nhiSearchTerm={nhiSearchTerm}
        setNhiSearchTerm={setNhiSearchTerm}
        onSearch={handleSearch}
      />
      {patientData && (
        <PatientDetails
          patientData={patientData}
          setPatientData={setPatientData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminView;
