const mysql = require('mysql2');
var pool_connection = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    multipleStatements: true
});
pool_connection.getConnection((err) => {
    if (err) console.log(JSON.stringify(err));
    else {
        console.log('Connected!')
    }
});
module.exports = pool_connection.promise();