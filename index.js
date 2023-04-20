const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcrypt')

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

app.post('/registrousuario', async (req,res) => {
    const { nua, nombre, appat, apmat, email, password, telefono} = req.body
    const sql = "INSERT INTO customers ( usu_nua, usu_nombre, usu_ap_pat, usu_ap_mat, usu_correo, usu_password, usu_telefono) VALUES ?";
    const salt = await bcrypt.genSalt(10)
    const contrasenaNueva = await bcrypt.hash(req.body.password, salt)
    const values = [
        nua,
        nombre, 
        appat, 
        apmat, 
        email, 
        contrasenaNueva, 
        telefono
    ]
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("1 Usuario insertado");
    });
})



const PORT = process.env.PORT || 12000

app.listen(PORT, () => {
    console.log(`Escuchando Puerto: ${PORT}`)
})

