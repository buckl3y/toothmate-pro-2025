// src/tests/NavBar.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../Components/NavBar/NavBar';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

// Mock child components and hooks

// Define the mock data outside to maintain reference
const patientsMockData = [
  { nhiNumber: 'ABC1234', name: 'John Doe' },
  { nhiNumber: 'DEF5678', name: 'Jane Smith' },
];

vi.mock('../Components/NavBar/AddPatient/AddPatientOverlay', () => {
  return {
    default: ({ isVisible }) =>
      isVisible ? <div data-testid="add-patient-overlay">AddPatientOverlay</div> : null,
  };
});

vi.mock('../Components/NavBar/AddPatient/AdminAddPatientOverlay', () => {
  return {
    default: ({ isVisible }) =>
      isVisible ? <div data-testid="admin-add-patient-overlay">AdminAddPatientOverlay</div> : null,
  };
});

vi.mock('../Components/NavBar/CautionModal', () => {
  return {
    default: ({ isOpen }) => (isOpen ? <div data-testid="caution-modal">CautionModal</div> : null),
  };
});

vi.mock('../Components/NavBar/ClickOutsideHandler', () => {
  return {
    __esModule: true,
    default: () => {},
  };
});

vi.mock('../Components/NavBar/searchbar/PatientSearchInput', () => {
  return {
    default: ({ searchTerm, setSearchTerm }) => (
      <input
        data-testid="patient-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    ),
  };
});

vi.mock('../Components/NavBar/searchbar/PatientDropdown', () => {
  return {
    default: ({ isDropdownOpen, filteredPatients, handleSelectPatient }) =>
      isDropdownOpen ? (
        <ul data-testid="patient-dropdown">
          {filteredPatients.map((patient) => (
            <li key={patient.nhiNumber} onClick={() => handleSelectPatient(patient)}>
              {patient.name}
            </li>
          ))}
        </ul>
      ) : null,
  };
});

vi.mock('../Components/NavBar/FetchPatients', () => {
  return {
    __esModule: true,
    default: () => patientsMockData, // Return the same array reference
  };
});

describe('NavBar', () => {
  const onSelectPatient = vi.fn();
  const onPatientUpdate = vi.fn();
  const onToggleView = vi.fn();

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <NavBar
          selectedPatient={null}
          onSelectPatient={onSelectPatient}
          onPatientUpdate={onPatientUpdate}
          onToggleView={onToggleView}
        />
      </MemoryRouter>
    );
  });

  it('shows AddPatientOverlay when "Add New Patient" button is clicked', () => {
    render(
      <MemoryRouter>
        <NavBar
          selectedPatient={null}
          onSelectPatient={onSelectPatient}
          onPatientUpdate={onPatientUpdate}
          onToggleView={onToggleView}
        />
      </MemoryRouter>
    );

    const addButton = screen.getByText('Add New Patient');
    fireEvent.click(addButton);

    expect(screen.getByTestId('add-patient-overlay')).toBeInTheDocument();
  });

  it('opens dropdown and shows filtered patients when search term is entered', () => {
    render(
      <MemoryRouter>
        <NavBar
          selectedPatient={null}
          onSelectPatient={onSelectPatient}
          onPatientUpdate={onPatientUpdate}
          onToggleView={onToggleView}
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId('patient-search-input');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByTestId('patient-dropdown')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows CautionModal when "Caution" button is clicked and patient is selected', () => {
    const selectedPatient = {
      nhiNumber: 'ABC1234',
      name: 'John Doe',
      caution: {
        allergies: [],
        medicalConditions: [],
        medication: [],
        patientPreferences: [],
      },
    };

    render(
      <MemoryRouter>
        <NavBar
          selectedPatient={selectedPatient}
          onSelectPatient={onSelectPatient}
          onPatientUpdate={onPatientUpdate}
          onToggleView={onToggleView}
        />
      </MemoryRouter>
    );

    const cautionButton = screen.getByText('Caution');
    fireEvent.click(cautionButton);

    expect(screen.getByTestId('caution-modal')).toBeInTheDocument();
  });
});
