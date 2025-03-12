
import PropTypes from 'prop-types';

const CautionModal = ({
  isOpen,
  onClose,
  cautionData,
  isEditing,
  onEditToggle,
  onCautionChange,
  onCautionAddItem,
  onCautionRemoveItem,
  onSave,
}) => {
  if (!isOpen) return null;

  const fields = [
    { label: 'Allergies', field: 'allergies' },
    { label: 'Medical Conditions', field: 'medicalConditions' },
    { label: 'Medication', field: 'medication' },
    { label: 'Patient Preferences', field: 'patientPreferences' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-1/2 max-w-lg p-6 rounded-lg relative overflow-y-auto max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Caution Information</h2>
        <div className="mt-4">
          {fields.map(({ label, field }) => (
            <div key={field} className="mb-4">
              <h3 className="font-semibold">{label}</h3>
              <ul className="list-disc list-inside">
                {(cautionData[field] || []).map((item, index) => (
                  <li key={index} className="flex items-center mt-1">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => onCautionChange(field, index, e.target.value)}
                          className="border p-1 mr-2 flex-1"
                        />
                        <button
                          onClick={() => onCautionRemoveItem(field, index)}
                          className="text-red-500 ml-2"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <span>{item}</span>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={() => onCautionAddItem(field)}
                  className="mt-2 text-blue-500"
                >
                  Add {label.slice(0, -1)}
                </button>
              )}
            </div>
          ))}
          <div className="flex justify-end mt-4">
            {isEditing ? (
              <button
                onClick={onSave}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Submit Changes
              </button>
            ) : (
              <button
                onClick={onEditToggle}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CautionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cautionData: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditToggle: PropTypes.func.isRequired,
  onCautionChange: PropTypes.func.isRequired,
  onCautionAddItem: PropTypes.func.isRequired,
  onCautionRemoveItem: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default CautionModal;
