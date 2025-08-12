const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const patients = require("../data/patients.js");
const normalizeNhiNumber = require("../utils/normalizeNhiNumber");
const sql = require("../utils/getConnection.js")(); 
const DbPatient = sql.models.Patient;

// Get all patients
router.get("/patients", async (req, res) => {
    const _patients = await DbPatient.findAll({include: sql.models.Treatment});
    let indexed_patients = {};
    _patients.forEach(patient => {
        indexed_patients[patient.nhiNumber] = patient;
    });
    res.json(indexed_patients);
    console.log("Fetched "+ Object.keys(indexed_patients).length +" patients.");
});

// Receives posts from the New DbPatient menu
router.post("/save-patient", async (req, res) => {
    const { patientName, nhiNumber, dateOfBirth, address, phone, teethLayout } =
        req.body;
    let { notes, toothTreatments, caution } = req.body;

    notes = notes || "";
    toothTreatments = toothTreatments || {};
    caution = caution || {};

    const newPatientId = normalizeNhiNumber(nhiNumber);

    // Check patient exitsts?
    if (await DbPatient.findOne({where: {nhiNumber: newPatientId}})) {
        console.log("NHI number "+ newPatientId +" already exists");
        return res.status(400).json({ error: "NHI number "+ newPatientId +" already exists" });
    }

    const patient = await DbPatient.create({
        nhiNumber: newPatientId,
        name: patientName,
        dateOfBirth: dateOfBirth,
        address: address,
        phone: phone
    });
    console.log("Just added patient " + patient.nhiNumber);
    return res.status(201).json({ message: "DbPatient created successfully", patient: patient });
});

// server.js
router.post("/update-patient", (req, res) => {
    console.log("updating patient");
    const { patient } = req.body;
    const normalizedNhi = normalizeNhiNumber(patient.nhiNumber);

    if (!patients[normalizedNhi]) {
        return res.status(404).json({ error: "DbPatient not found" });
    }

    patients[normalizedNhi] = patient;

    const filePath = path.join(__dirname, "..", "data", "patients.js");
    const updatedPatients = `const patients = ${JSON.stringify(
        patients,
        null,
        2
    )};\n\nmodule.exports = patients;`;

    fs.writeFile(filePath, updatedPatients, "utf8", (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res
                .status(500)
                .json({ error: "Could not update patient information" });
        }
        res.status(200).json({
            message: "DbPatient information updated successfully!",
        });
    });
});

/// Get a single patient by nhi number
/// Responds 200 if found, 404 if not.
router.get("/patient/:nhi", async (req, res) => {
    const { nhi } = req.params;
    const normalizedNhi = normalizeNhiNumber(nhi);

    // Check patient exitsts?
    const patient = await DbPatient.findOne({where: {nhiNumber: normalizedNhi}, include: sql.models.Treatment});
    if (patient) {
        console.log("Returning patient " + normalizedNhi );
        return res.status(200).json(JSON.stringify(patient, null, 4));
    }
    return res.status(404).json({"error": "patient "+ normalizedNhi +" not found."});
});

router.put("/updateinfo/:nhiNumber", (req, res) => {
    const { nhiNumber } = req.params;
    const normalizedNhi = normalizeNhiNumber(nhiNumber).toUpperCase();

    console.log(`Updating patient with NHI: ${normalizedNhi}`);
    console.log(req.body);

    // Check if patient exists
    if (!patients[normalizedNhi]) {
        console.log(`DbPatient with NHI ${normalizedNhi} not found.`);
        return res.status(404).json({ error: "DbPatient not found." });
    }

    // Extract updated data from request body
    const { name, dateOfBirth, address, phone } = req.body;

    // Perform validation
    if (!name || !dateOfBirth || !address || !phone) {
        console.log("Validation failed: Missing required fields.");
        return res
            .status(400)
            .json({
                error: "All fields (name, dateOfBirth, address, phone) are required.",
            });
    }

    // Update patient data
    patients[normalizedNhi] = {
        ...patients[normalizedNhi],
        name,
        dateOfBirth,
        address,
        phone,
    };

    console.log(`DbPatient ${normalizedNhi} updated:`, patients[normalizedNhi]);

    // Write updated patients to 'patients.js'
    const filePath = path.join(__dirname, "..", "data", "patients.js");
    const updatedPatients = `const patients = ${JSON.stringify(
        patients,
        null,
        2
    )};\n\nmodule.exports = patients;`;

    fs.writeFile(filePath, updatedPatients, "utf8", (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res
                .status(500)
                .json({ error: "Could not update patient information" });
        }
        res.status(200).json({
            message: "DbPatient information updated successfully!",
            patient: patients[normalizedNhi],
        });
        console.log("success");
    });
});

module.exports = router;
