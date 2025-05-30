// src/tests/Notes.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notes from '../Components/Notes/Notes';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Notes Component', () => {
  const mockNhi = 'ABC1234';
  const mockDate = '2023-10-10';
  const mockNote = 'Initial note';
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders without crashing and displays the note', () => {
    render(<Notes nhi={mockNhi} date={mockDate} note={mockNote} onUpdate={mockOnUpdate} />);

    expect(screen.getByText(mockNote)).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('enters edit mode when Edit button is clicked', () => {
    render(<Notes nhi={mockNhi} date={mockDate} note={mockNote} onUpdate={mockOnUpdate} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Submit Changes')).toBeInTheDocument();
  });

  it('updates note when submitted', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<Notes nhi={mockNhi} date={mockDate} note={mockNote} onUpdate={mockOnUpdate} />);

    // Enter edit mode
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Change the note
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated note' } });

    // Submit changes
    const submitButton = screen.getByText('Submit Changes');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${import.meta.env.VITE_SERVER_URL}/api/update-notes`,
        {
          nhi: mockNhi,
          date: mockDate,
          notes: 'Updated note',
        }
      );
      expect(mockOnUpdate).toHaveBeenCalledWith('Updated note');
      expect(screen.getByText('Updated note')).toBeInTheDocument();
    });
  });

  it('handles axios error when submitting note', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    console.error = vi.fn(); // Mock console.error to suppress error output in test

    render(<Notes nhi={mockNhi} date={mockDate} note={mockNote} onUpdate={mockOnUpdate} />);

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'));

    // Submit changes without changing the note
    fireEvent.click(screen.getByText('Submit Changes'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Failed to update the notes:', expect.any(Error));
    });

    console.error.mockRestore();
  });
});
