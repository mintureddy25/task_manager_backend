const mysql = require("mysql2");

dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();