
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import PatientSearchInput from './searchbar/PatientSearchInput';
import PatientDropdown from './searchbar/PatientDropdown';
import useFetchPatients from './FetchPatients';
import useClickOutside from './ClickOutsideHandler';
import AddPatientOverlay from './AddPatient/AddPatientOverlay';
import { Link } from 'react-router-dom';
import AdminAddPatientOverlay from './AddPatient/AdminAddPatientOverlay';
import CautionModal from './CautionModal';
import { updateCaution } from '../../api';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ selectedPatient, onSelectPatient, onPatientUpdate, onToggleView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [refreshPatients, setRefreshPatients] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const dropdownRef = useRef(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const patients = useFetchPatients(serverUrl, refreshPatients);
  const [isAdminAddPatientOverlayVisible, setIsAdminAddPatientOverlayVisible] = useState(false);
  const navigate = useNavigate()

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleSelectPatient = (patient) => {
    onSelectPatient(patient.nhiNumber, patient);
    setIsDropdownOpen(false);
  };

  const handleNewPatientClick = () => {
    if (isAdminView) {
      setIsAdminAddPatientOverlayVisible(true);
    } else {
      setIsOverlayVisible(true);
    }
  };

  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
  };

  const triggerPatientRefresh = () => {
    setRefreshPatients((prev) => !prev);
  };

  const handleToggleView = () => {
    setIsAdminView(!isAdminView);
    onToggleView(!isAdminView);
  };

  useEffect(() => {
    if (searchTerm) {
      setIsDropdownOpen(true);
      setFilteredPatients(
        patients.filter(
          (patient) =>
            patient.nhiNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setIsDropdownOpen(false);
      setFilteredPatients([]);
    }
  }, [searchTerm, patients]);

  // Caution Modal State and Functions
  const [isCautionModalOpen, setIsCautionModalOpen] = useState(false);
  const [isEditingCaution, setIsEditingCaution] = useState(false);
  const [cautionData, setCautionData] = useState({
    allergies: selectedPatient?.caution?.allergies || [],
    medicalConditions: selectedPatient?.caution?.medicalConditions || [],
    medication: selectedPatient?.caution?.medication || [],
    patientPreferences: selectedPatient?.caution?.patientPreferences || [],
  });

  useEffect(() => {
    setCautionData({
      allergies: selectedPatient?.caution?.allergies || [],
      medicalConditions: selectedPatient?.caution?.medicalConditions || [],
      medication: selectedPatient?.caution?.medication || [],
      patientPreferences: selectedPatient?.caution?.patientPreferences || [],
    });
  }, [selectedPatient]);

  const handleCautionToggle = () => {
    if (selectedPatient) {
      setIsCautionModalOpen(true);
      setIsEditingCaution(false);
    } else {
      alert('Please select a patient to view caution information.');
    }
  };

  const handleCloseModal = () => {
    setIsCautionModalOpen(false);
    setIsEditingCaution(false);
  };

  const handleCautionEditToggle = () => {
    setIsEditingCaution(!isEditingCaution);
  };

  const handleCautionChange = (field, index, value) => {
    const updatedField = [...(cautionData[field] || [])];
    updatedField[index] = value;
    setCautionData({
      ...cautionData,
      [field]: updatedField,
    });
  };

  const handleCautionAddItem = (field) => {
    setCautionData({
      ...cautionData,
      [field]: [...(cautionData[field] || []), ''],
    });
  };

  const handleCautionRemoveItem = (field, index) => {
    const updatedField = [...(cautionData[field] || [])];
    updatedField.splice(index, 1);
    setCautionData({
      ...cautionData,
      [field]: updatedField,
    });
  };

  const handleCautionSave = async () => {
    try {
      await updateCaution(selectedPatient.nhiNumber, cautionData);
      const updatedPatient = {
        ...selectedPatient,
        caution: cautionData,
      };
      onPatientUpdate(updatedPatient);
      setIsEditingCaution(false);
      setIsCautionModalOpen(false);
    } catch (error) {
      console.error('Failed to update caution information:', error);
    }
  };

  return (
    <>
      <nav className="bg-black rounded-lg max-w-full bg-white text-white p-4 pl-1 flex justify-between items-center z-50">
        <Link to="/" className="flex items-center space-x-2 pl-4">
          <img src='logo.svg' style={{height: '40px', marginRight: "5px"}} />
          <div className="text-logo-purple font-extrabold text-4xl">ToothMate</div>
          <div className="text-logo-dark-purple font-extrabold text-4xl">Pro</div>
        </Link>
        <div className="pr-4 relative flex items-center space-x-4">
          <button className='btn' onClick={() => navigate("/prototype")}>
            Figma
          </button>
        {selectedPatient && (
          <button
            onClick={handleCautionToggle}
            className="btn-warning py-2 px-4 rounded mr-2"
          >
            Caution
          </button>
        )}
          <button
            className="btn py-2 px-4 rounded"
            onClick={handleNewPatientClick}
          >
            Add New Patient
          </button>
          {!isAdminView && (
            <>
              <div className="flex flex-col search-bar-container w-50" ref={dropdownRef}>
                <PatientSearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <PatientDropdown
                  isDropdownOpen={isDropdownOpen}
                  filteredPatients={filteredPatients}
                  handleSelectPatient={handleSelectPatient}
                />
              </div>
            </>
          )}
          {/* Toggle Avatar */}
          <img
            src={isAdminView ? '/assets/avatar/admin.png' : '/assets/avatar/alana.jpeg'}
            alt={isAdminView ? 'Admin View' : 'Dentist View'}
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={handleToggleView}
          />
        </div>
      </nav>

      <CautionModal
        isOpen={isCautionModalOpen}
        onClose={handleCloseModal}
        cautionData={cautionData}
        isEditing={isEditingCaution}
        onEditToggle={handleCautionEditToggle}
        onCautionChange={handleCautionChange}
        onCautionAddItem={handleCautionAddItem}
        onCautionRemoveItem={handleCautionRemoveItem}
        onSave={handleCautionSave}
      />

      <AddPatientOverlay
        isVisible={isOverlayVisible}
        onClose={handleOverlayClose}
        onSaveSuccess={triggerPatientRefresh}
        onSelectPatient={onSelectPatient}
      />
      {isAdminAddPatientOverlayVisible && (
        <AdminAddPatientOverlay
          isVisible={isAdminAddPatientOverlayVisible}
          onClose={() => setIsAdminAddPatientOverlayVisible(false)}
          onSaveSuccess={triggerPatientRefresh}
        />
      )}
    </>
  );
};

NavBar.propTypes = {
  selectedPatient: PropTypes.object,
  onSelectPatient: PropTypes.func.isRequired,
  onPatientUpdate: PropTypes.func.isRequired,
  onToggleView: PropTypes.func.isRequired,
};

export default NavBar;
