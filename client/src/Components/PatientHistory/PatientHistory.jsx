// PatientHistory.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { updatePatient } from '../../api';
import AddEntryModal from './_components/AddEntryModal';

const PatientHistory = ({ patient, onSelectNote, onPatientUpdate, currentTeethLayout }) => {
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(null);
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [newEntryProcedure, setNewEntryProcedure] = useState('');

  const handleEntryClick = (index, notes, date, teethLayout) => {
    setSelectedEntryIndex(index);
    onSelectNote(notes, date, teethLayout);
  };

  const handleAddEntry = () => {
    setIsAddEntryModalOpen(true);
    setNewEntryProcedure('');
  };

  const handleAddEntrySubmit = async () => {
    if (!newEntryProcedure) {
      alert('Please enter a procedure.');
      return;
    }

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      notes: '',
      teethLayout: JSON.parse(JSON.stringify(currentTeethLayout)),
      procedure: newEntryProcedure,
      toothTreatments: {}, 
    };

    const updatedPatient = {
      ...patient,
      patientHistory: [newEntry, ...patient.patientHistory],
    };

    try {
      await updatePatient(updatedPatient);
      onPatientUpdate(updatedPatient);
      setSelectedEntryIndex(0);
      onSelectNote(newEntry.notes, newEntry.date, newEntry.teethLayout);
      setIsAddEntryModalOpen(false);
    } catch (error) {
      console.error('Failed to add new entry:', error);
    }
  };

  const handleDeleteEntry = async () => {
    if (selectedEntryIndex === null) {
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (!confirmDelete) {
      return;
    }

    const updatedPatientHistory = [...patient.patientHistory];
    updatedPatientHistory.splice(selectedEntryIndex, 1);

    const updatedPatient = {
      ...patient,
      patientHistory: updatedPatientHistory,
    };

    try {
      await updatePatient(updatedPatient);
      onPatientUpdate(updatedPatient);
      setSelectedEntryIndex(null);
      onSelectNote('', '', []);
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  if (!patient) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md h-full relative">
        <h2 className="text-lg font-semibold mb-4">Patient History</h2>
        <p className="text-gray-500">Select a patient to view their history.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-full relative flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">Patient History</h2>
      </div>
      {patient.patientHistory.length === 0 ? (
        <p className="text-gray-500">No history available for this patient.</p>
      ) : (
        <ul className="mt-4 overflow-y-auto max-h-64 flex-grow">
          {patient.patientHistory.map((entry, index) => (
            <li
              key={index}
              className={`flex justify-between border-b border-black py-1 cursor-pointer ${
                selectedEntryIndex === index ? 'bg-blue-300' : 'hover:bg-gray-200'
              }`}
              onClick={() =>
                handleEntryClick(
                  index,
                  entry.notes,
                  entry.date,
                  entry.teethLayout
                )
              }
              style={{
                backgroundColor: selectedEntryIndex === index ? '#3182ce' : '',
                color: selectedEntryIndex === index ? 'white' : 'black',
              }}
            >
              <span>{entry.procedure || 'No procedure listed'}</span>
              <span>{entry.date}</span>
            </li>
          ))}
        </ul>
      )}
      {/* Buttons at the bottom */}
      <div className="flex justify-end mt-4 gap-2">
        <button onClick={handleAddEntry} className="bg-green-500 text-white py-2 px-4 rounded">
          Add Entry
        </button>
        <button
          onClick={handleDeleteEntry}
          className="bg-red-500 text-white py-2 px-4 rounded"
          disabled={selectedEntryIndex === null}
        >
          Delete
        </button>
      </div>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isAddEntryModalOpen}
        onClose={() => setIsAddEntryModalOpen(false)}
        newEntryProcedure={newEntryProcedure}
        setNewEntryProcedure={setNewEntryProcedure}
        onSubmit={handleAddEntrySubmit}
      />
    </div>
  );
};

PatientHistory.propTypes = {
  patient: PropTypes.shape({
    nhiNumber: PropTypes.string.isRequired,
    patientHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        procedure: PropTypes.string,
        notes: PropTypes.string,
        teethLayout: PropTypes.array.isRequired,
        toothTreatments: PropTypes.object.isRequired, 
      })
    ).isRequired,
    caution: PropTypes.shape({
      allergies: PropTypes.arrayOf(PropTypes.string),
      medicalConditions: PropTypes.arrayOf(PropTypes.string),
      medication: PropTypes.arrayOf(PropTypes.string),
      patientPreferences: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  onSelectNote: PropTypes.func.isRequired,
  onPatientUpdate: PropTypes.func.isRequired,
  currentTeethLayout: PropTypes.array.isRequired,
};

export default PatientHistory;
