const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const patients = require("../data/patients.js");
const normalizeNhiNumber = require("../utils/normalizeNhiNumber");

// Get all patients
router.get("/patients", (req, res) => {
    console.log("Fetching all patients");
    res.json(patients);
    console.log("success");
});

// Return the mouth data for a given patient.
// Temporarily implemented with hard-coded data.
// @author Skye Pooley
// Updated 29 May
router.get("/mouthdata", (req, res) => {
    console.log("fetching placeholder mouth");
    let wholeMouth = {
        t_11: {
            index: "11",
            treatments: {
                fillings: [
                    {
                        faces: ["mesial", "occlusal"],
                        dateAdded: ["11-10-2012"],
                        material: "composite",
                    },
                ],
                crowns: [],
            },
            conditions: {
                cavities: [],
            },
        },
    };
    res.json(wholeMouth);
});

// Server code (e.g., app.js or server.js)
router.post("/save-patient", (req, res) => {
    console.log("saving patient");
    const { patientName, nhiNumber, dateOfBirth, address, phone, teethLayout } =
        req.body;
    let { notes, toothTreatments, caution } = req.body;

    notes = notes || "";
    toothTreatments = toothTreatments || {};
    caution = caution || {};

    const newPatientId = normalizeNhiNumber(nhiNumber);

    if (patients[newPatientId]) {
        return res.status(400).json({ error: "NHI number already exists" });
    }

    patients[newPatientId] = {
        nhiNumber: newPatientId,
        name: patientName,
        dateOfBirth: dateOfBirth,
        address: address,
        phone: phone,
        caution: caution, // Store caution at the patient level
        patientHistory: [
            {
                date: new Date().toISOString().split("T")[0],
                teethLayout: teethLayout,
                notes: notes,
                toothTreatments: toothTreatments,
            },
        ],
        xrayHistory: {},
    };

    const filePath = path.join(__dirname, "..", "data", "patients.js");
    const updatedPatients = `const patients = ${JSON.stringify(
        patients,
        null,
        2
    )};\n\nmodule.exports = patients;`;

    fs.writeFile(filePath, updatedPatients, "utf8", (err) => {
        if (err) {
            return res.status(500).json({ error: "Could not save patient" });
        }

        res.status(200).json({
            message: "Patient saved successfully!",
            patientId: newPatientId,
        });
        console.log("success");
    });
});

// server.js
router.post("/update-patient", (req, res) => {
    console.log("updating patient");
    const { patient } = req.body;
    const normalizedNhi = normalizeNhiNumber(patient.nhiNumber);

    if (!patients[normalizedNhi]) {
        return res.status(404).json({ error: "Patient not found" });
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
            message: "Patient information updated successfully!",
        });
    });
});
router.get("/patient/:nhi", (req, res) => {
    console.log("getting patient");
    const { nhi } = req.params;
    const normalizedNhi = normalizeNhiNumber(nhi);

    if (!patients[normalizedNhi]) {
        return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patients[normalizedNhi]);
    console.log("success");
});

router.put("/updateinfo/:nhiNumber", (req, res) => {
    const { nhiNumber } = req.params;
    const normalizedNhi = normalizeNhiNumber(nhiNumber).toUpperCase();

    console.log(`Updating patient with NHI: ${normalizedNhi}`);
    console.log(req.body);

    // Check if patient exists
    if (!patients[normalizedNhi]) {
        console.log(`Patient with NHI ${normalizedNhi} not found.`);
        return res.status(404).json({ error: "Patient not found." });
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

    console.log(`Patient ${normalizedNhi} updated:`, patients[normalizedNhi]);

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
            message: "Patient information updated successfully!",
            patient: patients[normalizedNhi],
        });
        console.log("success");
    });
});

module.exports = router;
