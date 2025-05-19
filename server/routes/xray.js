const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const patients = require('../data/patients.js');
const normalizeNhiNumber = require('../utils/normalizeNhiNumber');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'xray');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload X-ray
router.post('/upload-xray', upload.single('file'), (req, res) => {
    console.log("uploading xray")
  const { patientId, fileName } = req.body;
  const normalizedPatientId = normalizeNhiNumber(patientId);

  if (!patients[normalizedPatientId]) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'File upload failed' });
  }

  // Update patient's xrayHistory
  const xrayHistory = patients[normalizedPatientId].xrayHistory || {};

  // The file URL to be stored in xrayHistory
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/xray/${req.file.filename}`;

  const date = new Date().toISOString().split('T')[0];

  xrayHistory[fileName] = {
    filepath: fileUrl,
    date: date,
  };
  patients[normalizedPatientId].xrayHistory = xrayHistory;

  // Save the updated patients data
  const filePath = path.join(__dirname, '..', 'data', 'patients.js');
  const updatedPatients = `const patients = ${JSON.stringify(
    patients,
    null,
    2
  )};\n\nmodule.exports = patients;`;

  fs.writeFile(filePath, updatedPatients, 'utf8', (err) => {
    if (err) {
      console.error('Error saving patient data:', err);
      return res.status(500).json({ error: 'Could not save patient data' });
    }

    res.status(200).json({ message: 'X-ray uploaded successfully!', fileUrl: fileUrl });
    console.log("success")
  });
});

// Check if X-ray filename exists
router.get('/check-xray-filename/:patientId/:fileName', (req, res) => {
    console.log("checking if xray file name exists")
  const { patientId, fileName } = req.params;

  const normalizedPatientId = normalizeNhiNumber(patientId);

  if (!patients[normalizedPatientId]) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const xrayHistory = patients[normalizedPatientId].xrayHistory || {};

  if (xrayHistory[fileName]) {
    return res.json({ exists: true });
    console.log("success")
  } else {
    return res.json({ exists: false });
    console.log("fail")
  }
});

// Delete X-ray
router.post('/delete-xray', (req, res) => {
    console.log("deleting xray")
  const { patientId, fileName } = req.body;
  const normalizedPatientId = normalizeNhiNumber(patientId);

  if (!patients[normalizedPatientId]) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const xrayHistory = patients[normalizedPatientId].xrayHistory || {};

  if (!xrayHistory[fileName]) {
    return res.status(404).json({ error: 'X-ray not found' });
  }

  // Get the file path
  const fileUrl = xrayHistory[fileName].filepath;
  const fileNameInServer = path.basename(fileUrl); // Extract the file name
  const fileFullPath = path.join(__dirname, '..', 'uploads', 'xray', fileNameInServer);

  // Delete the file from the filesystem
  fs.unlink(fileFullPath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      // Proceed to remove from xrayHistory even if file deletion fails
    }

    // Remove from xrayHistory
    delete xrayHistory[fileName];
    patients[normalizedPatientId].xrayHistory = xrayHistory;

    // Save the updated patients data
    const patientsFilePath = path.join(__dirname, '..', 'data', 'patients.js');
    const updatedPatients = `const patients = ${JSON.stringify(
      patients,
      null,
      2
    )};\n\nmodule.exports = patients;`;

    fs.writeFile(patientsFilePath, updatedPatients, 'utf8', (err) => {
      if (err) {
        console.error('Error saving patient data:', err);
        return res.status(500).json({ error: 'Could not save patient data' });
      }

      res.status(200).json({ message: 'X-ray deleted successfully!' });
      console.log("success")
    });
  });
});

module.exports = router;
