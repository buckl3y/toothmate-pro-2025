// TreatmentPlan.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ToothModel from '../Dashboard/DentistView/Chart/Tooth';
import {Canvas} from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { updatePatient } from '../../api';

const TreatmentPlan = ({ toothUrl, patient, selectedDate, onClose, onUpdatePatient }) => {
  const toothName = toothUrl.split('/').pop().replace('.glb', '');

  // State initialization
  const [toothTreatments, setToothTreatments] = useState([]);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);
  const [selectedTreatmentOption, setSelectedTreatmentOption] = useState(null);
  const [selectedToothSurface, setSelectedToothSurface] = useState(null);

  // Helper function to get the patient history entry based on selectedDate
  const getPatientHistoryEntry = () => {
    return (
      patient.patientHistory.find((entry) => entry.date === selectedDate) || {
        toothTreatments: {},
      }
    );
  };

  // Load treatments when patient, toothUrl, or selectedDate changes
  useEffect(() => {
    const historyEntry = getPatientHistoryEntry();
    if (!historyEntry) {
      console.warn(`No patient history entry found for date ${selectedDate}`);
      setToothTreatments([]);
      return;
    }

    const treatments = historyEntry.toothTreatments?.[toothUrl] || [];
    const treatmentsWithValidIds = treatments.map((t, index) => {
      let id = Number(t.id);
      if (isNaN(id)) {
        id = index + 1;
      }
      return { ...t, id };
    });

    const sortedTreatments = treatmentsWithValidIds.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setToothTreatments(sortedTreatments);
    if (sortedTreatments.length > 0) {
      setSelectedTreatmentId(sortedTreatments[0].id);
    } else {
      setSelectedTreatmentId(null);
    }
  }, [patient, toothUrl, selectedDate]);

  // Update selected options when selectedTreatmentId changes
  useEffect(() => {
    if (selectedTreatmentId !== null) {
      const treatment = toothTreatments.find((t) => t.id === selectedTreatmentId);
      if (treatment) {
        setSelectedTreatmentOption(treatment.treatmentOption);
        setSelectedToothSurface(treatment.toothSurface);
      }
    } else {
      setSelectedTreatmentOption(null);
      setSelectedToothSurface(null);
    }
  }, [selectedTreatmentId, toothTreatments]);

  const getNewId = () => {
    const ids = toothTreatments.map((t) => Number(t.id)).filter((id) => !isNaN(id));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  };

  const handleTreatmentSummarySelect = (treatmentId) => {
    setSelectedTreatmentId(treatmentId);
  };

  const handleAddTreatment = async () => {
    if (!selectedTreatmentOption || !selectedToothSurface) {
      alert('Please select a treatment option and tooth surface.');
      return;
    }

    // Create new treatment entry
    const newId = getNewId();
    const newTreatment = {
      id: newId,
      treatmentOption: selectedTreatmentOption,
      toothSurface: selectedToothSurface,
      date: new Date().toISOString().split('T')[0],
    };

    // Update treatments
    const updatedTreatments = [newTreatment, ...toothTreatments];
    setToothTreatments(updatedTreatments);
    setSelectedTreatmentId(newId);

    // Update patient data
    const updatedPatient = { ...patient };
    const historyEntryIndex = updatedPatient.patientHistory.findIndex(
      (entry) => entry.date === selectedDate
    );
    if (historyEntryIndex === -1) {
      console.error(`No patient history entry found for date ${selectedDate}`);
      return;
    }

    const historyEntry = { ...updatedPatient.patientHistory[historyEntryIndex] };
    const toothTreatmentsObject = { ...historyEntry.toothTreatments };
    toothTreatmentsObject[toothUrl] = updatedTreatments;
    historyEntry.toothTreatments = toothTreatmentsObject;
    updatedPatient.patientHistory[historyEntryIndex] = historyEntry;

    // Call the parent update function
    onUpdatePatient(updatedPatient);
    try {
      await updatePatient(updatedPatient);
      onUpdatePatient(updatedPatient);
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const handleDeleteTreatment = () => {
    if (!selectedTreatmentId) {
      alert('Please select a treatment to delete.');
      return;
    }

    const updatedTreatments = toothTreatments.filter((t) => t.id !== selectedTreatmentId);
    setToothTreatments(updatedTreatments);
    setSelectedTreatmentId(null);

    // Update patient data
    const updatedPatient = { ...patient };
    const historyEntryIndex = updatedPatient.patientHistory.findIndex(
      (entry) => entry.date === selectedDate
    );
    if (historyEntryIndex === -1) {
      console.error(`No patient history entry found for date ${selectedDate}`);
      return;
    }

    const historyEntry = { ...updatedPatient.patientHistory[historyEntryIndex] };
    const toothTreatmentsObject = { ...historyEntry.toothTreatments };
    toothTreatmentsObject[toothUrl] = updatedTreatments;
    historyEntry.toothTreatments = toothTreatmentsObject;
    updatedPatient.patientHistory[historyEntryIndex] = historyEntry;

    // Call the parent update function
    onUpdatePatient(updatedPatient);
  };

  const toothNumber = parseInt(toothName.slice(0, 2), 10);

  // Initialize rotation for adult teeth
  let rotation = [0, 0, 0];
  let position = [0, 3, 25];

  // Determine rotation based on tooth number
  if (
    (toothNumber >= 51 && toothNumber <= 55) || // Upper right baby teeth
    (toothNumber >= 61 && toothNumber <= 65)    // Upper left baby teeth
  ) {
    // Upper baby teeth
    rotation = [0, 0, 0];
  } else if (
    (toothNumber >= 71 && toothNumber <= 75) || // Lower left baby teeth
    (toothNumber >= 81 && toothNumber <= 85)    // Lower right baby teeth
  ) {
    // Lower baby teeth
    rotation = [0, 0, 0];
  } else {
    // Adult teeth
    rotation = [0, 0, 0];
    position = [0, 3, 10];
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 mt-2">
      {/* Back button positioned at top-left */}
      <button
        onClick={onClose}
        className="absolute top-5 left-0 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 self-start ml-4"
      >
        Back to Chart
      </button>
      <h1 className="text-3xl">{toothName}</h1>

      <div className="flex flex-row gap-2 align-center justify-center">
        {/* Current Tooth */}
        <div className="flex flex-col gap-4 items-center justify-center self-start">
          <h2 className="text-xl font-bold">Current Tooth</h2>
          <div className="w-56 h-72 flex items-center justify-center border-2 border-logo-purple rounded-2xl ">
            <Canvas className="w-full h-full" camera={{ position: position, fov: 80 }}>
            <Environment preset="city" />
              <ambientLight />
              <ToothModel
  url={toothUrl}
  position={[0, 0, 0]}
  rotation={rotation}
  scale={[1, 1, 1]}
  interactive={false}
  selectedTreatmentOption={selectedTreatmentOption} 
/>
            </Canvas>
          </div>
        </div>

        {/* Treatment Options */}
        <div className="flex flex-col gap-4 items-center justify-center self-start">
          <h2 className="text-xl font-bold">Treatment Options</h2>
          <div className="flex flex-col gap-2 border-2 border-logo-purple rounded-2xl w-56 h-72 items-center justify-center drop-shadow-md">
            {['Filling', 'Crown', 'Veneer', 'Root Canal', 'Extraction'].map((option) => (
              <button
                key={option}
                className={`p-1 rounded w-40 ${
                  selectedTreatmentOption === option
                    ? 'bg-logo-purple text-white border-button-purple-border'
                    : 'bg-button-purple border border-button-purple-border hover:bg-button-purple-border'
                }`}
                onClick={() => setSelectedTreatmentOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Tooth Surface */}
        <div className="flex flex-col gap-4 items-center justify-center self-start">
          <h2 className="text-xl font-bold">Tooth Surface</h2>
          <div className="flex flex-col gap-2 border-2 border-logo-purple rounded-2xl w-56 h-72 items-center justify-center">
            <div className="flex flex-col justify-center items-center gap-2 items-stretch w-40 drop-shadow-md">
              {/* Row 1: B */}
              <div className="flex justify-center">
                <button
                  className={`p-2 rounded w-full ${
                    selectedToothSurface === 'B'
                      ? 'bg-logo-purple text-white border-button-purple-border'
                      : 'bg-button-purple border border-button-purple-border hover:bg-button-purple-border'
                  }`}
                  onClick={() => setSelectedToothSurface('B')}
                >
                  B
                </button>
              </div>

              {/* Row 2: M, I, P */}
              <div className="flex justify-between items-center gap-2 w-full">
                {['M', 'I', 'P'].map((surface) => (
                  <button
                    key={surface}
                    className={`p-2 rounded flex-grow ${
                      selectedToothSurface === surface
                        ? 'bg-logo-purple text-white border-button-purple-border'
                        : 'bg-button-purple border border-button-purple-border hover:bg-button-purple-border'
                    }`}
                    onClick={() => setSelectedToothSurface(surface)}
                    aria-pressed={selectedToothSurface === surface}
                  >
                    {surface}
                  </button>
                ))}
              </div>

              {/* Row 3: D */}
              <div className="flex justify-center">
                <button
                  className={`p-2 rounded w-full ${
                    selectedToothSurface === 'D'
                      ? 'bg-logo-purple text-white border-button-purple-border'
                      : 'bg-button-purple border border-button-purple-border hover:bg-button-purple-border'
                  }`}
                  onClick={() => setSelectedToothSurface('D')}
                >
                  D
                </button>
              </div>
            </div>
            {selectedTreatmentOption && selectedToothSurface && (
        <button
          onClick={handleAddTreatment}
          className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 w-40"
        >
          Add to List
        </button>
      )}
          </div>
        </div>

        {/* Treatment Summary */}
        <div className="flex flex-col gap-4 items-center justify-center self-start">
          <h2 className="text-xl font-bold">Treatment Summary</h2>
          <div className="flex flex-col gap-2 border-2 border-logo-purple rounded-2xl w-56 h-72 items-center justify-center drop-shadow-md overflow-y-auto">
            {toothTreatments
              .sort((a, b) => b.id - a.id) // Sort descending by id
              .map((treatment) => (
                <button
                  key={treatment.id}
                  className={`p-2 rounded w-40 ${
                    selectedTreatmentId === treatment.id
                      ? 'bg-logo-purple text-white border-button-purple-border'
                      : 'bg-button-purple border border-button-purple-border hover:bg-button-purple-border'
                  }`}
                  onClick={() => handleTreatmentSummarySelect(treatment.id)}
                >
                  {treatment.date} - {treatment.treatmentOption}
                </button>
              ))}
            <button
              onClick={handleDeleteTreatment}
              className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 w-40"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TreatmentPlan.propTypes = {
  toothUrl: PropTypes.string.isRequired,
  patient: PropTypes.shape({
    patientHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        toothTreatments: PropTypes.object,
      })
    ).isRequired,
  }).isRequired,
  selectedDate: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdatePatient: PropTypes.func.isRequired,
};

export default TreatmentPlan;
