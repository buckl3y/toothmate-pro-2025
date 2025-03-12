// src/tests/TreatmentPlan.test.jsx
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import TreatmentPlan from '../Components/TreatmentPlan/TreatmentPlan';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { updatePatient } from '../api';

// Mock updatePatient API call
vi.mock('../api', () => ({
  updatePatient: vi.fn(),
}));

// Mock ToothModel component
vi.mock('../Components/Chart/Tooth', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="tooth-model">Tooth Model</div>,
  };
});

// Mock Canvas and Environment components
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
}));
vi.mock('@react-three/drei', () => ({
  Environment: () => <div data-testid="environment">Environment</div>,
}));

describe('TreatmentPlan Component', () => {
  const mockPatient = {
    patientHistory: [
      {
        date: '2023-10-01',
        toothTreatments: {
          'toothUrl1': [
            {
              id: 1,
              treatmentOption: 'Filling',
              toothSurface: 'B',
              date: '2023-10-01',
            },
          ],
        },
      },
    ],
  };

  const mockOnClose = vi.fn();
  const mockOnUpdatePatient = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders without crashing and displays tooth name', () => {
    render(
      <TreatmentPlan
        toothUrl="toothUrl1"
        patient={mockPatient}
        selectedDate="2023-10-01"
        onClose={mockOnClose}
        onUpdatePatient={mockOnUpdatePatient}
      />
    );

    expect(screen.getByText('toothUrl1')).toBeInTheDocument();
    expect(screen.getByText('Treatment Options')).toBeInTheDocument();
    expect(screen.getByText('Tooth Surface')).toBeInTheDocument();
    expect(screen.getByText('Treatment Summary')).toBeInTheDocument();
  });

  it('handles deleting a treatment', async () => {
    render(
      <TreatmentPlan
        toothUrl="toothUrl1"
        patient={mockPatient}
        selectedDate="2023-10-01"
        onClose={mockOnClose}
        onUpdatePatient={mockOnUpdatePatient}
      />
    );
  
    // Get the Treatment Summary section
    const treatmentSummarySection = screen.getByText('Treatment Summary').parentElement;
  
    // Within the Treatment Summary, find the treatment button
    const treatmentButton = within(treatmentSummarySection).getByText('2023-10-01 - Filling');
    fireEvent.click(treatmentButton);
  
    // Click 'Delete' button within the Treatment Summary
    const deleteButton = within(treatmentSummarySection).getByText('Delete');
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(mockOnUpdatePatient).toHaveBeenCalled();
    });
  
    // Verify the treatment is removed from the Treatment Summary
    expect(within(treatmentSummarySection).queryByText('2023-10-01 - Filling')).not.toBeInTheDocument();
  });
});
