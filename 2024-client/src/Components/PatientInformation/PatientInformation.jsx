
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

const PatientInformation = ({ patient, onUpdate }) => {
    const { name = '', dateOfBirth = '', address = '', phone = '' } = patient || {};

    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState({
        name,
        dateOfBirth,
        address,
        phone,
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [statusColor, setStatusColor] = useState('');

    // ================================
    // ===== EVENT HANDLERS START =====
    // ================================

    // FLIPS THE `isEditing` state. (true / false)
    const handleEditToggle = () => {
        // updates the flag
        setIsEditing(!isEditing);

        // updates the patient information, incase there's been changes made
        setEditedPatient({ name, dateOfBirth, address, phone });

        // clears any status messages that may have occured - e.g. 'Name is required'
        setStatusMessage('');
    };

    // called everytime there is a change detected `onChange` variable for <input/>
    const handleChange = (e) => {

        const { name, value } = e.target;
        setEditedPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            // Perform validation if necessary
            // Example: Ensure required fields are not empty
            if (!editedPatient.name.trim()) {
                setStatusMessage('Name is required.');
                setStatusColor('text-red-500');
                return;
            }

            // Send the updated patient data to the backend
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/updateinfo/${patient.nhiNumber}`, editedPatient);

            console.log('Patient updated:', response.data);

            setStatusMessage('Patient information updated successfully!');
            setStatusColor('text-green-500');

            // Notify parent component to update its state
            onUpdate({ ...patient, ...response.data });

            // Exit edit mode after a short delay
            setTimeout(() => {
                setIsEditing(false);
                setStatusMessage('');
            }, 1500);
        } catch (error) {
            console.error('Failed to update patient:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setStatusMessage(`Error: ${error.response.data.error}`);
            } else {
                setStatusMessage('Failed to update patient information.');
            }
            setStatusColor('text-red-500');
        }
    };

    // ================================
    // ====== EVENT HANDLERS END ======
    // ================================

    // ===== RETURN STATEMENT HERE =====
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md w-1/2 h-full">
            <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
            {statusMessage && <p className={`mb-4 ${statusColor}`}>{statusMessage}</p>}
            {!isEditing ? (
                // THIS IS DISPLAYED, IF PATIENT INFORMATION IS NOT BEING EDITIED
                <ul className="space-y-2">
                    <li className="border-b border-gray-300 pb-2">Name: {name}</li>
                    <li className="border-b border-gray-300 pb-2">Date of Birth: {dateOfBirth}</li>
                    <li className="border-b border-gray-300 pb-2">Address: {address}</li>
                    <li className="border-b border-gray-300 pb-2">Phone: {phone}</li>
                </ul>
            )
            // THIS IS DISPLAYED IF THE PATIENT DETAILS ARE BEING EDITED.
            : (
                <div className="">
                    <div className="flex flex-row justify-center items-center gap-2">
                        <label className="text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editedPatient.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 whitespace-nowrap h-8"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                        <label className="text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={editedPatient.dateOfBirth}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 whitespace-nowrap h-8"
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                        <label className="text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={editedPatient.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 whitespace-nowrap h-8"
                            placeholder="e.g. 123 Main St, Anytown, USA"
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                        <label className="text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={editedPatient.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 whitespace-nowrap h-8"
                            placeholder="e.g. 555-1234"
                        />
                    </div>
                </div>
            )}

            {/* =======BUTTONS ARE HERE======= */}
            <div className="mt-4 flex justify-end space-x-2">

                {/* BUTTON TO ENABLE EDITING */}
                {!isEditing ? (
                    <button
                        onClick={handleEditToggle}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Edit
                    </button>
                ) 
                // BUTTON TO SAVE OR CANCEL THE EDITS
                : (
                    <>
                        <button
                            onClick={handleSave}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleEditToggle}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

PatientInformation.propTypes = {
    patient: PropTypes.shape({
        nhiNumber: PropTypes.string,
        name: PropTypes.string,
        dateOfBirth: PropTypes.string,
        address: PropTypes.string,
        phone: PropTypes.string,
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default PatientInformation;
