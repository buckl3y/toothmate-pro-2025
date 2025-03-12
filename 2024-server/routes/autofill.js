const express = require('express');
const router = express.Router();
const autofillData = require('../data/autofill.js');
const normalizeNhiNumber = require('../utils/normalizeNhiNumber');

// Autofill by NHI Number (Specific Route)
router.get('/nhi/:nhiNumber', (req, res) => {
    console.log("Fetching autofill data by NHI");
    const { nhiNumber } = req.params;
    const normalizedNhi = normalizeNhiNumber(nhiNumber).toUpperCase();

    console.log(`NHI Input: ${nhiNumber}, Normalized: ${normalizedNhi}`);

    const patient = autofillData[normalizedNhi];

    if (!patient) {
        return res.status(404).json({ error: 'Patient not found by NHI' });
    }

    res.json({ nhiNumber: normalizedNhi, ...patient });
    console.log("Patient data retrieved successfully by NHI");
});

// Autofill by Phone Number (Specific Route)
router.get('/phone/:phoneNumber', (req, res) => {
    console.log("Fetching autofill data by Phone");
    const { phoneNumber } = req.params;
    const normalizedPhone = phoneNumber.trim();

    console.log(`Phone Input: ${phoneNumber}, Normalized: ${normalizedPhone}`);

    // Search for patient by phone number
    const patientEntry = Object.entries(autofillData).find(
        ([nhi, patient]) => patient.phone === normalizedPhone
    );

    console.log('Patient Entry:', patientEntry);

    if (!patientEntry) {
        return res.status(404).json({ error: 'Patient not found by phone number' });
    }

    const [nhiNumber, patient] = patientEntry;
    res.json({ nhiNumber, ...patient });
    console.log("Patient data retrieved successfully by Phone");
});


module.exports = router;
