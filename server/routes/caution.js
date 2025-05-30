const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const patients = require('../data/patients.js');
const normalizeNhiNumber = require('../utils/normalizeNhiNumber');

router.post('/update-caution', (req, res) => {
    console.log("updating caution")
    let { nhi, caution } = req.body;
    nhi = normalizeNhiNumber(nhi);

    console.log("Updating caution information for NHI:", nhi);

    if (!patients[nhi]) {
        console.error('Patient not found:', nhi);
        return res.status(404).json({ error: 'Patient not found' });
    }

    patients[nhi].caution = caution;

    const filePath = path.join(__dirname, '..', 'data', 'patients.js');
    const updatedPatients = `const patients = ${JSON.stringify(patients, null, 2)};\n\nmodule.exports = patients;`;

    fs.writeFile(filePath, updatedPatients, 'utf8', (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).json({ error: 'Could not update caution information' });
        }

        res.status(200).json({ message: 'Caution information updated successfully!' });
        console.log("success")
    });
});

module.exports = router;