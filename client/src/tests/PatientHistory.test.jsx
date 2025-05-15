// src/tests/PatientHistory.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatientHistory from '../Components/PatientHistory/PatientHistory';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { updatePatient } from '../api';

// Mock updatePatient API call
vi.mock('../api', () => ({
  updatePatient: vi.fn(),
}));

describe('PatientHistory Component', () => {
  const mockPatient = {
    nhiNumber: 'ABC1234',
    patientHistory: [
      {
        date: '2023-10-01',
        procedure: 'Procedure 1',
        notes: 'Notes 1',
        teethLayout: [],
        toothTreatments: {},
      },
      {
        date: '2023-10-02',
        procedure: 'Procedure 2',
        notes: 'Notes 2',
        teethLayout: [],
        toothTreatments: {},
      },
    ],
    caution: {},
  };

  const mockOnSelectNote = vi.fn();
  const mockOnPatientUpdate = vi.fn();
  const mockCurrentTeethLayout = [];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders without crashing and shows patient history', () => {
    render(
      <PatientHistory
        patient={mockPatient}
        onSelectNote={mockOnSelectNote}
        onPatientUpdate={mockOnPatientUpdate}
        currentTeethLayout={mockCurrentTeethLayout}
      />
    );

    expect(screen.getByText('Patient History')).toBeInTheDocument();
    expect(screen.getByText('Procedure 1')).toBeInTheDocument();
    expect(screen.getByText('Procedure 2')).toBeInTheDocument();
  });

  it('shows message when no patient is selected', () => {
    render(
      <PatientHistory
        patient={null}
        onSelectNote={mockOnSelectNote}
        onPatientUpdate={mockOnPatientUpdate}
        currentTeethLayout={mockCurrentTeethLayout}
      />
    );

    expect(screen.getByText('Select a patient to view their history.')).toBeInTheDocument();
  });



});
