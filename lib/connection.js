const mysql = require('mysql');

const options = {
    host: 'db', //'localhost'
    port: 3306,
    user: 'library',
    password: 'library',
    database: 'library'
};

var connection = mysql.createConnection(options);

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;