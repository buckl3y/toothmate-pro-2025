
import PropTypes from 'prop-types';
import CautionInformation from './CautionInformation';

const PatientDetails = ({
  patientData,
  setPatientData,
  isEditing,
  setIsEditing,
  onSave,
}) => {
  const handleInputChange = (field, value) => {
    setPatientData({
      ...patientData,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Patient Information</h2>
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold">Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={patientData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{patientData.name}</p>
          )}
        </div>
        {/* Date of Birth */}
        <div>
          <label className="block font-semibold">Date of Birth:</label>
          {isEditing ? (
            <input
              type="date"
              value={patientData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{patientData.dateOfBirth}</p>
          )}
        </div>
        {/* Address */}
        <div>
          <label className="block font-semibold">Address:</label>
          {isEditing ? (
            <input
              type="text"
              value={patientData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{patientData.address}</p>
          )}
        </div>
        {/* Phone */}
        <div>
          <label className="block font-semibold">Phone:</label>
          {isEditing ? (
            <input
              type="text"
              value={patientData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{patientData.phone}</p>
          )}
        </div>
        {/* NHI Number */}
        <div>
          <label className="block font-semibold">NHI Number:</label>
          <p>{patientData.nhiNumber}</p>
        </div>
        {/* Caution Information */}
        <CautionInformation
          caution={patientData.caution}
          setCaution={(newCaution) =>
            setPatientData({ ...patientData, caution: newCaution })
          }
          isEditing={isEditing}
        />
        {/* Additional Fields */}
        {/* Add more fields as necessary */}
      </div>
      {/* Edit and Save Buttons */}
      <div className="mt-6 flex space-x-4">
        {isEditing ? (
          <button onClick={onSave} className="bg-green-500 text-white py-2 px-4 rounded">
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

PatientDetails.propTypes = {
  patientData: PropTypes.object.isRequired,
  setPatientData: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default PatientDetails;
