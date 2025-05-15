
import PropTypes from 'prop-types';

const AddEntryModal = ({
  isOpen,
  onClose,
  newEntryProcedure,
  setNewEntryProcedure,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-1/2 max-w-lg p-6 rounded-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
        <div className="mt-4">
          <label className="block mb-2">Procedure:</label>
          <input
            type="text"
            value={newEntryProcedure}
            onChange={(e) => setNewEntryProcedure(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter procedure"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={onSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AddEntryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newEntryProcedure: PropTypes.string.isRequired,
  setNewEntryProcedure: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddEntryModal;
