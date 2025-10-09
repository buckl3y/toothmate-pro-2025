const express = require("express");
const router = express.Router();
const normalizeNhiNumber = require("../utils/normalizeNhiNumber");
const sql = require("../utils/getConnection.js")(); 
const DbPatient = sql.models.Patient;
const DbTreatment = sql.models.Treatment;

// Get all patients
router.get("/patients", async (req, res) => {
    const _patients = await DbPatient.findAll({
        include: [
            {
                model: sql.models.Treatment,
                include: [sql.models.ToothSurface, sql.models.Note]
            },
            {
                model: sql.models.Condition,
                include: [sql.models.Note]
            },
            {
                model: sql.models.Note,
            }
        ]
    });
    let indexed_patients = {};
    _patients.forEach(patient => {
        indexed_patients[patient.nhiNumber] = patient;
    });
    res.json(indexed_patients);
    console.log("Fetched "+ Object.keys(indexed_patients).length +" patients.");
});


/// Get a single patient by nhi number
/// Responds 200 if found, 404 if not.
router.get("/patient/:nhi", async (req, res) => {
    const { nhi } = req.params;
    const normalizedNhi = normalizeNhiNumber(nhi);

    // Check patient exitsts?
    const patient = await DbPatient.findOne({
        where: { nhiNumber: normalizedNhi },
        include: [
            {
                model: sql.models.Treatment,
                include: [sql.models.ToothSurface, sql.models.Note]
            },
            {
                model: sql.models.Condition,
                include: [sql.models.Note]
            },
            {
                model: sql.models.Note
            }
        ]
    });
    if (patient) {
        console.log("Returning patient " + normalizedNhi );
        return res.status(200).json(patient);
    }
    return res.status(404).json({"error": "patient "+ normalizedNhi +" not found."});
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


/**
 * Adds a new treatment for a patient.
 * Associates notes and surfaces.
 * 
 * @author Skye Pooley
 */
router.post("/add-treatment", async (req, res) => {
    const {patient, treatment} = req.body;
    console.log("Adding treatment: " + JSON.stringify(treatment))

    const db_patient = await DbPatient.findOne({
        where: {nhiNumber: patient.nhiNumber}, 
        include: [sql.models.Treatment, sql.models.Note]
    });
    if (!patient) { return res.status(400).json({success: false, message: "Could not find associated patient."}) }

    try {
        const db_treatment = await sql.models.Treatment.create({
            procedure: treatment.procedure, 
            tooth: treatment.tooth,
            datePlanned: treatment.plannedDate,
            planned: treatment.planned,
            material: treatment.material,
            materialTone: treatment.materialTone,
        });
        
        treatment.surfaces.forEach(async (surface) => {
            const db_surface = await sql.models.ToothSurface.findOne({where: {name: surface}});
            if (db_surface) {
                db_treatment.addToothSurface(db_surface);
            } else {
                console.log("Error: Could not find tooth surface " + surface);
            }
        });
        await db_patient.addTreatment(db_treatment);

        treatment.notes.forEach(async (note) => {
            if (note == '') {return;}
            const db_note = await sql.models.Note.create({
                body: note,
                author: "dentist",
            });
            await db_treatment.addNote(db_note);
            await db_patient.addNote(db_note);
        });

        console.log("Successfully added treatment: " + JSON.stringify(db_treatment));
        return res.status(201).json({success: true, message: "Treatment saved to database", patient: db_patient, treatment: db_treatment})  
    }
    catch(ex) {
        return res.status(500).json({message: "unable to save new treatment", error: ex});
    }
    
});

router.post('/add-condition', async (req, res) => {
    const {patient, condition} = req.body;
    console.log("Adding condition: " + JSON.stringify(condition));

    const db_patient = await DbPatient.findOne({
        where: {nhiNumber: patient.nhiNumber}, 
        include: [sql.models.Condition, sql.models.Note]
    });
    if (!patient) { return res.status(400).json({success: false, message: "Could not find associated patient."}) }

    try {
        const db_condition = await sql.models.Condition.create({
            name: condition.name,
            tooth: condition.tooth
        });

        condition.notes.forEach(async (note) => {
            if (note == '') {return;}
            const db_note = await sql.models.Note.create({
                body: note,
                author: "dentist",
            });
            await db_condition.addNote(db_note);
            await db_patient.addNote(db_note);
        });
        await db_patient.addCondition(db_condition)

        return res.status(201).json({success: true, message: "saved condition to database", patient: db_patient, condition: db_condition})
    }
    catch(ex) {
        console.error("Error in /add-condition:", ex);
        return res.status(500).json({
            message: "Unable to save condition",
            error: ex.message || ex.toString(),
            stack: ex.stack || null
        });
    }
})

module.exports = router;
