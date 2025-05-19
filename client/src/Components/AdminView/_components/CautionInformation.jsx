
import PropTypes from 'prop-types';

const CautionInformation = ({ caution, setCaution, isEditing }) => {
  const fields = [
    'allergies',
    'medicalConditions',
    'medication',
    'patientPreferences',
  ];

  const handleCautionChange = (field, index, value) => {
    const updatedField = [...(caution[field] || [])];
    updatedField[index] = value;
    setCaution({
      ...caution,
      [field]: updatedField,
    });
  };

  const handleCautionAddItem = (field) => {
    setCaution({
      ...caution,
      [field]: [...(caution[field] || []), ''],
    });
  };

  const handleCautionRemoveItem = (field, index) => {
    const updatedField = [...(caution[field] || [])];
    updatedField.splice(index, 1);
    setCaution({
      ...caution,
      [field]: updatedField,
    });
  };

  return (
    <div>
      <label className="block font-semibold">Caution Information:</label>
      <div className="mt-2 p-4 border rounded bg-yellow-50">
        {fields.map((field) => (
          <div key={field} className="mb-4">
            <h3 className="font-semibold capitalize">
              {field.replace(/([A-Z])/g, ' $1')}:
            </h3>
            <ul className="list-disc list-inside">
              {(caution[field] || []).map((item, index) => (
                <li key={index} className="flex items-center mt-1">
                  {isEditing ? (
                    <>
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
                    </>
                  ) : (
                    <span>{item}</span>
                  )}
                </li>
              ))}
            </ul>
            {isEditing && (
              <button
                onClick={() => handleCautionAddItem(field)}
                className="mt-2 text-blue-500"
              >
                Add {field.slice(0, -1)}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

CautionInformation.propTypes = {
  caution: PropTypes.object.isRequired,
  setCaution: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default CautionInformation;
