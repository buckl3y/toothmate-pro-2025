import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';  // <-- Import this to get additional matchers
import AdminView from '../Components/AdminView/AdminView.jsx';
import { getPatientById, updatePatient } from '../api.jsx';

// Mock the API calls
vi.mock('../api.jsx', () => ({
  getPatientById: vi.fn(),
  updatePatient: vi.fn(),
}));

describe('AdminView Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the AdminSearch component', () => {
    render(<AdminView />);
    expect(screen.getByPlaceholderText(/Search NHI Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
  });

  it('fetches and displays patient data on search', async () => {
    const mockPatientData = {
      id: 'ABC1234',
      name: 'John Doe',
      caution: {},
    };
    getPatientById.mockResolvedValueOnce({ data: mockPatientData });

    render(<AdminView />);

    // Enter NHI and click search
    fireEvent.change(screen.getByPlaceholderText(/Search NHI Number/i), { target: { value: 'ABC1234' } });
    fireEvent.click(screen.getByText(/Search/i));

    // Wait for patient data to appear
    await waitFor(() => {
      expect(getPatientById).toHaveBeenCalledWith('ABC1234');
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });


  it('allows editing and saving patient data', async () => {
    const mockPatientData = {
      id: 'ABC1234',
      name: 'John Doe',
      caution: {},
    };
    getPatientById.mockResolvedValueOnce({ data: mockPatientData });
    updatePatient.mockResolvedValueOnce({});

    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<AdminView />);

    // Fetch patient data
    fireEvent.change(screen.getByPlaceholderText(/Search NHI Number/i), { target: { value: 'ABC1234' } });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    // Enter edit mode
    fireEvent.click(screen.getByText(/Edit/i));

    // Change patient name
    fireEvent.change(screen.getByDisplayValue(/John Doe/i), { target: { value: 'Jane Smith' } });

    // Save changes
    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(updatePatient).toHaveBeenCalledWith({
        ...mockPatientData,
        name: 'Jane Smith',
      });
      expect(alertMock).toHaveBeenCalledWith('Patient information updated successfully');
    });

    alertMock.mockRestore();
  });
});
