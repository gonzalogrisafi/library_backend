const mysql = require('mysql');

const options = {
    host: 'localhost',  //db
    user: 'library',
    password: 'library',
    database: 'library'
};

var connection = mysql.createConnection(options);

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;