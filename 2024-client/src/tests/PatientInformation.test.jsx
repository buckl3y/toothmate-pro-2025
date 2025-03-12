// src/tests/PatientInformation.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatientInformation from '../Components/PatientInformation/PatientInformation';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('PatientInformation Component', () => {
  const mockPatient = {
    nhiNumber: 'ABC1234',
    name: 'John Doe',
    dateOfBirth: '1990-01-01',
    address: '123 Main St',
    phone: '555-1234',
  };
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders patient information correctly', () => {
    render(<PatientInformation patient={mockPatient} onUpdate={mockOnUpdate} />);

    expect(screen.getByText(`Name: ${mockPatient.name}`)).toBeInTheDocument();
    expect(screen.getByText(`Date of Birth: ${mockPatient.dateOfBirth}`)).toBeInTheDocument();
    expect(screen.getByText(`Address: ${mockPatient.address}`)).toBeInTheDocument();
    expect(screen.getByText(`Phone: ${mockPatient.phone}`)).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('enters edit mode when Edit button is clicked', () => {
    render(<PatientInformation patient={mockPatient} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByDisplayValue(mockPatient.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockPatient.dateOfBirth)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockPatient.address)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockPatient.phone)).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('updates patient information when saved', async () => {
    const updatedPatientData = { ...mockPatient, name: 'Jane Smith' };
    axios.put.mockResolvedValueOnce({ data: updatedPatientData });

    render(<PatientInformation patient={mockPatient} onUpdate={mockOnUpdate} />);

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'));

    // Change the name
    fireEvent.change(screen.getByDisplayValue(mockPatient.name), {
      target: { value: 'Jane Smith' },
    });

    // Save changes
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `${import.meta.env.VITE_SERVER_URL}/api/updateinfo/${mockPatient.nhiNumber}`,
        expect.objectContaining({ name: 'Jane Smith' })
      );
      expect(mockOnUpdate).toHaveBeenCalledWith(updatedPatientData);
      expect(screen.getByText('Patient information updated successfully!')).toBeInTheDocument();
    });
  });

  it('handles validation error when name is empty', async () => {
    render(<PatientInformation patient={mockPatient} onUpdate={mockOnUpdate} />);

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'));

    // Clear the name
    fireEvent.change(screen.getByDisplayValue(mockPatient.name), {
      target: { value: ' ' },
    });

    // Save changes
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(axios.put).not.toHaveBeenCalled();
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
    });
  });
});
