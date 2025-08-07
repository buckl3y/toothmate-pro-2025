const { Sequelize, DataTypes } = require("sequelize");


module.exports = async function createDatabaseObjects(sql) {
    await sql.define(
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
    ).sync({force: false, alter: true}); // Apply to DB if different.

}

