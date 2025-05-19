import { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = ({ nhi, date, note, onUpdate }) => {
    const [editNote, setEditNote] = useState(note);
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        setEditNote(note);
    }, [note]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setEditNote(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/update-notes`, {
                nhi,
                date,
                notes: editNote
            });
            console.log("Note updated successfully");
            // Update the note locally
            onUpdate(editNote);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update the notes:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md w-1/2 h-full relative">
            <h2 className="text-lg font-semibold mb-2">Notes</h2>
            <hr className="border-t border-gray-300 mb-4" />
            {!isEditing ? (
                <>
                    <p className="text-pink-500">{editNote || 'No notes available.'}</p>
                    <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-4 right-4">
                        Edit
                    </button>
                </>
            ) : (
                <>
                    <textarea
                        className="form-textarea mt-1 block w-full border rounded-md"
                        rows="3"
                        value={editNote}
                        onChange={handleInputChange}
                    ></textarea>
                    <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">
                        Submit Changes
                    </button>
                </>
            )}
        </div>
    );
};

export default Notes;
