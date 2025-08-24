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
            datePlanned: {type: DataTypes.DATE, allowNull: true },
            dateCompleted: {type: DataTypes.DATE, allowNull: true },
            procedure: {type: DataTypes.STRING, allowNull: false},
            tooth: {type: DataTypes.STRING, allowNull: false} 
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

    ToothSurface.hasMany(Treatment);

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

    // This needs to happen after the tables have been synced.
    // Uncomment if database has been reset.
    await ToothSurface.create({name: "incisal", appliesTo: "fore"});
    await ToothSurface.create({name: "occlusal", appliesTo: "rear"});
    await ToothSurface.create({name: "mesial", appliesTo: "all"});
    await ToothSurface.create({name: "distal", appliesTo: "all"});
    await ToothSurface.create({name: "lingual", appliesTo: "all"});
    await ToothSurface.create({name: "facial", appliesTo: "all"});

    sql.sync();
}

