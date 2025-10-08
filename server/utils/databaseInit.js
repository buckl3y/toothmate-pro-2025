const { DataTypes } = require("sequelize");

/*
    Create the database tables and associations in code.
    Check the docs on the Sequelize website for details.

    @author Skye Pooley
*/
module.exports = async function createDatabaseObjects(sql) {
    // Patient object stores personal details and is used to join treatments, conditions, notes, etc.
    const Patient = await sql.define(
        "Patient",
        {
            nhiNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dateOfBirth: {
                type: DataTypes.DATE,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            caution: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }
    );

    // Treatments on teeth, for example: fillings, crowns.
    const Treatment = await sql.define(
        "Treatment",
        {
            planned: {type: DataTypes.BOOLEAN, allowNull: false},
            datePlanned: {type: DataTypes.DATE, allowNull: true},
            dateCompleted: {type: DataTypes.DATE, allowNull: true },
            procedure: {type: DataTypes.STRING, allowNull: false},
            tooth: {type: DataTypes.STRING, allowNull: false},
            material:  DataTypes.STRING,
            materialTone: DataTypes.STRING
        }
    );

    Patient.hasMany(Treatment);

    // Conditions that teeth can have. for example: cavities, impaction.
    const Condition = await sql.define(
        "Condition",
        {
            name: {type: DataTypes.STRING, allowNull: false},
            tooth: {type: DataTypes.STRING, allowNull: false}
        }
    );

    Patient.hasMany(Condition);

    const ToothSurface = await sql.define(
        "ToothSurface",
        {
            name: {type: DataTypes.STRING, allowNull: false},
            appliesTo: {type: DataTypes.STRING, allowNull: false}
        }
    );

    Treatment.belongsToMany(ToothSurface, {through: 'TreatmentToothSurfaces'});

    const Note = await sql.define(
        "Note",
        {
            body: {type: DataTypes.STRING, allowNull: false},
            author: {type: DataTypes.STRING, default: "dentist"}
        }
    );
    Patient.hasMany(Note);
    Treatment.hasMany(Note);
    Condition.hasMany(Note);

    await sql.sync({modify: true, force: false});

    // This needs to happen after the tables have been created.
    const surfaces = [
        { name: "incisal", appliesTo: "fore" },
        { name: "occlusal", appliesTo: "rear" },
        { name: "mesial", appliesTo: "all" },
        { name: "distal", appliesTo: "all" },
        { name: "lingual", appliesTo: "all" },
        { name: "facial", appliesTo: "all" }
    ];
    for (const surface of surfaces) {
        const exists = await ToothSurface.findOne({ where: surface });
        if (!exists) {
            await ToothSurface.create(surface);
        }
    }

    sql.sync();
}

