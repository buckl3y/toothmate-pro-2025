const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const patients = require('../data/patients.js');
const normalizeNhiNumber = require('../utils/normalizeNhiNumber');

router.post('/update-history', (req, res) => {
    console.log("updating history")
    let { nhi, notes, teethLayout, procedure } = req.body;
    nhi = normalizeNhiNumber(nhi); // Normalize NHI number

    console.log("Creating a new history entry for NHI:", nhi);

    // Check if patient exists
    if (!patients[nhi]) {
        console.error('Patient not found:', nhi);
        return res.status(404).json({ error: 'Patient not found' });
    }

    const patientHistory = patients[nhi].patientHistory;

    // Create a new history entry with a unique ID
    try {
        const newId = patientHistory.length > 0 ? Math.max(...patientHistory.map(entry => entry.id)) + 1 : 1;
        const newEntry = {
            id: newId,
            procedure,
            date: new Date().toISOString().split('T')[0], // Use the current date for the new entry
            teethLayout: teethLayout || [], // Ensure teethLayout is an array
            notes: notes || '', // Ensure notes is a string
            toothTreatments: {} // Initialize with an empty object
        };
        patientHistory.push(newEntry);

        // Write the updated patients data back to the file
        const filePath = path.join(__dirname, 'data', 'patients.js');
        const updatedPatients = `const patients = ${JSON.stringify(patients, null, 2)};\n\nmodule.exports = patients;`;

        fs.writeFile(filePath, updatedPatients, 'utf8', (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return res.status(500).json({ error: 'Could not update patient history' });
            }

            res.status(200).json({ message: 'History entry created successfully!' });
            console.log("success")
        });
    } catch (error) {
        console.error("An error occurred while creating the history entry:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/delete-history', (req, res) => {
    console.log("deleting history")
    const { nhi, date } = req.body;

    if (!patients[nhi]) {
        return res.status(404).json({ error: 'Patient not found' });
    }

    const patientHistory = patients[nhi].patientHistory;
    const updatedHistory = patientHistory.filter(entry => entry.date !== date);

    if (updatedHistory.length === patientHistory.length) {
        return res.status(404).json({ error: 'History entry not found for the specified date' });
    }

    patients[nhi].patientHistory = updatedHistory;

    const filePath = path.join(__dirname, 'data', 'patients.js');
    const updatedPatients = `const patients = ${JSON.stringify(patients, null, 2)};\n\nmodule.exports = patients;`;

    fs.writeFile(filePath, updatedPatients, 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not delete patient history' });
        }

        res.status(200).json({ message: 'History entry deleted successfully!' });
        console.log("success")
    });
});


router.post('/update-notes', (req, res) => {
    console.log("updating notes")
    const { nhi, date, notes } = req.body;

    console.log(`Updating notes for patient: ${nhi} on date: ${date}`);
    // Check if the patient exists
    if (!patients[nhi]) {
        console.error(`Patient with NHI ${nhi} not found`);
        return res.status(404).json({ error: 'Patient not found' });
    }

    // Find the correct history entry by date
    const patientHistory = patients[nhi].patientHistory;
    const historyEntry = patientHistory.find(entry => entry.date === date);

    if (!historyEntry) {
        console.error(`History entry on date ${date} not found`);
        return res.status(404).json({ error: 'History entry not found for the specified date' });
    }
    // Update the notes
    historyEntry.notes = notes;

    // Write the updated patients object back to the file
    const filePath = path.join(__dirname, '..', 'data', 'patients.js');
    const updatedPatients = `const patients = ${JSON.stringify(patients, null, 2)};\n\nmodule.exports = patients;`;

    fs.writeFile(filePath, updatedPatients, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ error: 'Could not update patient notes' });
        }
        console.log('Patient notes updated successfully');
        res.status(200).json({ message: 'Notes updated successfully!' });
        console.log("success")
    });
});

module.exports = router;