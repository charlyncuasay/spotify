const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spotify'
});

db.connect((err) => {
    if (err) throw err;
    console.log('connected to mysql database');
});

module.exports = db;