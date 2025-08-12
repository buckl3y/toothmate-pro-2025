// AdminAddPatientOverlay.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AdminAddPatientOverlay = ({ isVisible, onClose, onSaveSuccess }) => {
  const [patientName, setPatientName] = useState('');
  const [nhiNumber, setNhiNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [caution, setCaution] = useState({
    allergies: [''],
    medicalConditions: [''],
    medication: [''],
    patientPreferences: [''],
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [statusColor, setStatusColor] = useState('');
  const [view, setView] = useState('mixed'); // Default to 'mixed'
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  if (!isVisible) {
    return null;
  }

  const handleCautionChange = (field, index, value) => {
    const updatedField = [...caution[field]];
    updatedField[index] = value;
    setCaution({
      ...caution,
      [field]: updatedField,
    });
  };

  const handleCautionAddItem = (field) => {
    setCaution({
      ...caution,
      [field]: [...caution[field], ''],
    });
  };

  const handleCautionRemoveItem = (field, index) => {
    const updatedField = [...caution[field]];
    updatedField.splice(index, 1);
    setCaution({
      ...caution,
      [field]: updatedField,
    });
  };

  const handleSavePatient = async () => {
    try {
      const response = await axios.post(`${serverUrl}/api/save-patient`, {
        patientName,
        nhiNumber,
        dateOfBirth,
        address,
        phone,
        notes,     
        caution,  
        teethLayout: view,
      });

      console.log('Patient saved:', response.data);

      // Trigger re-fetching of patients
      onSaveSuccess();

      // Provide feedback before closing overlay
      setStatusMessage('Patient saved successfully!');
      setStatusColor('text-green-500');

      // Wait for a short time to let the user see the message
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close the overlay
      onClose();
    } catch (error) {
      console.error('Error:', error);

      if (error.response && error.response.data && error.response.data.error) {
        setStatusMessage(`Error: ${error.response.data.error}`);
        setStatusColor('text-red-500');
      } else {
        setStatusMessage('Failed to save patient.');
        setStatusColor('text-red-500');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-screen">

        <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
        {statusMessage && <p className={`mb-4 ${statusColor}`}>{statusMessage}</p>}

        {/* Patient Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Patient Name</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* NHI Number */}
        <div className="mb-4">
          <label className="block text-gray-700">NHI Number</label>
          <input
            type="text"
            value={nhiNumber}
            onChange={(e) => setNhiNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Teeth Layout View */}
        <div className="radio-group flex flex-row gap-3 mb-4">
          <input
            type="radio"
            id="adult-view"
            name="view"
            value="adult"
            checked={view === 'adult'}
            onChange={(e) => setView(e.target.value)}
          />
          <label htmlFor="adult-view">Adult View</label>

          <input
            type="radio"
            id="deciduous-view"
            name="view"
            value="deciduous"
            checked={view === 'deciduous'}
            onChange={(e) => setView(e.target.value)}
          />
          <label htmlFor="deciduous-view">Deciduous View</label>

          <input
            type="radio"
            id="mixed-view"
            name="view"
            value="mixed"
            checked={view === 'mixed'}
            onChange={(e) => setView(e.target.value)}
          />
          <label htmlFor="mixed-view">Mixed View</label>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        {/* Caution Information */}
        <div className="mb-4">
          <label className="block text-gray-700">Caution Information</label>
          <div className="mt-2 p-4 border rounded bg-yellow-50">
            {['allergies', 'medicalConditions', 'medication', 'patientPreferences'].map(
              (field) => (
                <div key={field} className="mb-4">
                  <h3 className="font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1')}:</h3>
                  {caution[field].map((item, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleCautionChange(field, index, e.target.value)}
                        className="border p-1 mr-2 flex-1"
                      />
                      <button
                        onClick={() => handleCautionRemoveItem(field, index)}
                        className="text-red-500 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleCautionAddItem(field)}
                    className="mt-2 text-blue-500"
                  >
                    Add {field.slice(0, -1)}
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={handleSavePatient} className="bg-blue-500 text-white py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

AdminAddPatientOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaveSuccess: PropTypes.func.isRequired,
};

export default AdminAddPatientOverlay;
