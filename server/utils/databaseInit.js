const { Sequelize, DataTypes } = require("sequelize");


module.exports = async function createDatabaseObjects(sql) {
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

    const Treatment = await sql.define(
        "Treatment",
        {
            date: DataTypes.DATE,
            notes: DataTypes.STRING,
            procedure: {type: DataTypes.STRING, allowNull: false},
            tooth: {type: DataTypes.STRING, allowNull: false} 
        }
    );

    Patient.hasMany(Treatment);

    sql.sync({modify: true});
}

