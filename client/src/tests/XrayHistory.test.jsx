
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import XrayHistory from '../Components/Dashboard/DentistView/XrayHistory/XrayHistory';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { uploadXray, deleteXray, checkXrayFilename } from '../api';

// Mock API calls
vi.mock('../api', () => ({
  uploadXray: vi.fn(),
  deleteXray: vi.fn(),
  checkXrayFilename: vi.fn(),
}));

// Mock window.confirm
beforeAll(() => {
  vi.spyOn(window, 'confirm').mockImplementation(() => true);
});

afterAll(() => {
  window.confirm.mockRestore();
});

describe('XrayHistory Component', () => {
  const mockPatientWithHistory = {
    nhiNumber: '123456789',
    xrayHistory: {
      'xray1.png': {
        filepath: '/path/to/xray1.png',
        date: '2023-10-01',
      },
      'xray2.png': {
        filepath: '/path/to/xray2.png',
        date: '2023-10-15',
      },
    },
  };

  const mockPatientWithoutHistory = {
    nhiNumber: '987654321',
    xrayHistory: {},
  };

  const mockRefreshPatientData = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  /**
   * Helper function to open the "View All" modal
   */
  const openViewAllModal = () => {
    const viewAllButton = screen.getByRole('button', { name: /View All/i });
    fireEvent.click(viewAllButton);
  };

  /**
   * Helper function to open the "Upload X-ray" modal from the "View All" modal
   */
  const openUploadModalFromViewAll = () => {
    openViewAllModal();
    // Find the 'Upload X-ray' button within the 'View All' modal
    const uploadXrayButton = screen.getByRole('button', { name: /Upload X-ray/i });
    fireEvent.click(uploadXrayButton);
  };

  /**
   * Helper function to get the latest 'Upload X-ray' modal
   */
  const getLatestUploadModal = () => {
    // Assuming that each modal has a heading 'Upload X-ray'
    const uploadModalTitles = screen.getAllByText('Upload X-ray');
    const latestTitle = uploadModalTitles[uploadModalTitles.length - 1];
    // Assuming the modal container is the parent of the title
    return latestTitle.closest('div');
  };

  it('renders without crashing and displays x-ray history', () => {
    render(<XrayHistory patient={mockPatientWithHistory} refreshPatientData={mockRefreshPatientData} />);

    expect(screen.getByText('X-Ray History')).toBeInTheDocument();
    expect(screen.getByText('xray1.png')).toBeInTheDocument();
    expect(screen.getByText('2023-10-01')).toBeInTheDocument();
    expect(screen.getByText('xray2.png')).toBeInTheDocument();
    expect(screen.getByText('2023-10-15')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View All/i })).toBeInTheDocument();
  });

  it('renders "No X-ray history available" when there is no xrayHistory', () => {
    render(<XrayHistory patient={mockPatientWithoutHistory} refreshPatientData={mockRefreshPatientData} />);

    expect(screen.getByText('No X-ray history available.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload X-ray/i })).toBeInTheDocument();
  });


});
