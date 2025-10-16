import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AddPatientOverlay = ({ isVisible, onClose, onSaveSuccess,onSelectPatient }) => {
    const [patientName, setPatientName] = useState('');
    const [nhiNumber, setNhiNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusColor, setStatusColor] = useState('');
    const [view, setView] = useState('adult'); // Default to 'mixed'


    if (!isVisible) {
        return null;
    }

    const handleSavePatient = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/save-patient`, 
            {
            patientName,
            nhiNumber,
            dateOfBirth,
            address,
            phone,
            teethLayout: view,
          });
    
          console.log('Patient saved:', response.data);
    
          // Trigger re-fetching of patients
          onSaveSuccess();
    
          // Provide feedback before loading dashboard
          setStatusMessage('Patient saved successfully!');
          setStatusColor('text-green-500');
    
          // Wait for a short time to let the user see the message
          await new Promise((resolve) => setTimeout(resolve, 1000));
    
          // Fetch the new patient's data
          const patientResponse = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/patient/${nhiNumber}`
          );
          const patientData = patientResponse.data;
    
          // Call onSelectPatient with the new patient data
          onSelectPatient(nhiNumber, patientData);
    
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
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
                {statusMessage && <p className={`mb-4 ${statusColor}`}>{statusMessage}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">
                        Patient Name
                    </label>
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 flex items-center">
                        NHI Number
                        <span className={`ml-2 ${statusColor}`}>{statusMessage}</span>
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            value={nhiNumber}
                            onChange={(e) => setNhiNumber(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            placeholder="Enter NHI or Search NHI"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="e.g. 12 Mary Sue Ave"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Phone</label>
                    <div className="flex">
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter Phone Number or search Phone Number"
                    />
                    </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="btn-secondary py-2 px-4 rounded">Cancel</button>
                    <button onClick={handleSavePatient} className="btn py-2 px-4 rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

AddPatientOverlay.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSaveSuccess: PropTypes.func.isRequired,
    onSelectPatient: PropTypes.func.isRequired,
};

export default AddPatientOverlay;
