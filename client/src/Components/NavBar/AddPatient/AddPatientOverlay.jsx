import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import templates from '../../data/templates';

const AddPatientOverlay = ({ isVisible, onClose, onSaveSuccess,onSelectPatient }) => {
    const [patientName, setPatientName] = useState('');
    const [nhiNumber, setNhiNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusColor, setStatusColor] = useState('');
    const [view, setView] = useState('mixed'); // Default to 'mixed'

    const handleChange = (event) => {
        setView(event.target.value);
    };

    if (!isVisible) {
        return null;
    }

    const handleSavePatient = async () => {
        const selectedTeethLayout = templates[`${view}View`] || templates['mixedView'];
        try {
          const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/save-patient`, {
            patientName,
            nhiNumber,
            dateOfBirth,
            address,
            phone,
            teethLayout: selectedTeethLayout,
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
    // Separate handler functions
    const handleAutofillByNhi = async () => {
        try {
            const inputValue = nhiNumber.trim().toLowerCase();

            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/autofill/nhi/${inputValue}`);
            const patientData = response.data;
            console.log('Patient Data:', patientData);

            setPatientName(patientData.name);
            const [month, day, year] = patientData.dateOfBirth.split('/');
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            setDateOfBirth(formattedDate);
            setAddress(patientData.address);
            setPhone(patientData.phone);

            setStatusMessage('Patient found and autofilled!');
            setStatusColor('text-green-500');
        } catch (error) {
            console.error('Failed to retrieve patient by NHI:', error);
            setStatusMessage('Patient not found by NHI.');
            setStatusColor('text-red-500');
        }
    };

    const handleAutofillByPhone = async () => {
        try {
            const inputValue = phone.trim();
            if (!inputValue) {
                setStatusMessage('Please enter a phone number.');
                setStatusColor('text-red-500');
                return;
            }

            console.log("Submitting Phone:", inputValue);
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/autofill/phone/${encodeURIComponent(inputValue)}`);
            const patientData = response.data;
            console.log('Patient Data:', patientData);

            setPatientName(patientData.name);
            const [month, day, year] = patientData.dateOfBirth.split('/');
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            setDateOfBirth(formattedDate);
            setAddress(patientData.address);
            setPhone(patientData.phone);

            setStatusMessage('Patient found and autofilled!');
            setStatusColor('text-green-500');
        } catch (error) {
            console.error('Failed to retrieve patient by Phone:', error);
            setStatusMessage('Patient not found by phone number.');
            setStatusColor('text-red-500');
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
                        <button
                            onClick={handleAutofillByNhi}
                            className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                        >
                            Autofill
                        </button>
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
                                            <button
                            onClick={handleAutofillByPhone}
                            className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                        >
                            Autofill
                        </button>
                        </div>
                </div>
                <div className="radio-group flex flex-row gap-3 mb-4">
                    <input
                        type="radio"
                        id="adult-view"
                        name="view"
                        value="adult"
                        checked={view === 'adult'}
                        onChange={handleChange}
                    />
                    <label htmlFor="adult-view">Adult View</label>

                    <input
                        type="radio"
                        id="deciduous-view"
                        name="view"
                        value="deciduous"
                        checked={view === 'deciduous'}
                        onChange={handleChange}
                    />
                    <label htmlFor="deciduous-view">Deciduous View</label>

                    <input
                        type="radio"
                        id="mixed-view"
                        name="view"
                        value="mixed"
                        checked={view === 'mixed'}
                        onChange={handleChange}
                    />
                    <label htmlFor="mixed-view">Mixed View</label>
                </div>
                
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
                    <button onClick={handleSavePatient} className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
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
