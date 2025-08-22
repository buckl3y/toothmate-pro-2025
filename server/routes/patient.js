const express = require("express");
const router = express.Router();
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
    const { patientName, nhiNumber, dateOfBirth, address, phone } =
        req.body;

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

    return res.status(500).json({success: false, message: "/update-patient route has not been updated to support database."})

    
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
        return res.status(200).json(patient);
    }
    return res.status(404).json({"error": "patient "+ normalizedNhi +" not found."});
});

// Update an existing patient's personal details.
router.put("/updateinfo/:nhiNumber", async (req, res) => {
    const { nhiNumber } = req.params;
    const normalizedNhi = normalizeNhiNumber(nhiNumber).toUpperCase();

    console.log(`Updating patient with NHI: ${normalizedNhi}`);
    console.log(req.body);

    // Check if patient exists
    const patient = await DbPatient.findOne({where: {nhiNumber: normalizedNhi}, include: sql.models.Treatment});
    if (!patient) {
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
    patient.name = name;
    patient.dateOfBirth = dateOfBirth;
    patient.address = address;
    patient.phone = phone;

    try{
        const updatedPatient = await patient.save();
        return res.status(200).json(updatedPatient);
    }
    catch (ex) {
        console.log(ex.error);
        return res.status(500).json("Could not update patient!");
    }
});

module.exports = router;
