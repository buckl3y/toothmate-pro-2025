const {Sequelize} = require('sequelize');

const sql = new Sequelize({
        dialect: 'mysql',
        host: process.env.DBIP,
        port: process.env.DBPORT,
        database: "toothmate",
        username: process.env.DBUSR,
        password: process.env.DBPWD,
        logging: msg => console.log("[DB] - " + msg)
    });

// Create an object to manage database connections.
// Uses credentials from .env
// This might change but for now you can use this env:
    // PORT=5005
    // DBIP=170.64.242.49
    // DBPORT=3306
    // DBUSR=client
    // DBPWD=password

/*
    Returns a configured instance of Sequelize to connect to the MySQL database.
*/
module.exports = function getConnection() {
    return sql;
}