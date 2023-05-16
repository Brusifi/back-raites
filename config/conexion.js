const mysql = require('mysql')

const connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: 'raites_db'
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("Conectado a la base de datos")
})

module.exports = connection