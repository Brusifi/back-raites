const mysql = require('mysql')
const express = require('express')


const app = express()

const connection = mysql.createConnection({
    host: "localhost:3306",
    user: "root",
    password: "password"
})
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("Conectado a la base de datos")
})

const PORT = process.env.PORT || 12000

app.listen(PORT, () => {
    console.log(`Escuchando Puerto: ${PORT}`)
})

