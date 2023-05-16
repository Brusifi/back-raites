const router = require('express').Router()
const bcrypt = require('bcrypt')
const connection = require('../config/conexion')
const jwt = require('jsonwebtoken')

router.get('/verusuarios', async (req,res) => {
    //res.send
    const sql = "SELECT * FROM usuario"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json({
            error: null,
            data: result
        })
    });
})

router.get('/infousuario', async (req, res) => {
    const nua = req.body.nua
    const sql = `SELECT * FROM usuario WHERE usu_nua = ${nua}`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json({
            error: null,
            data: result
        })
    });
});

router.post('/usuariologin', async (req, res) => {
    const { email, password } = req.body
    const sql = `SELECT usu_correo,usu_password,usu_nua,usu_nombre FROM usuario WHERE usu_correo = '${email}'`
    connection.query(sql, async function (err, result) {
        if (err) throw err;
        if(result.length === 0) {
            return res.status(400).json({
                error: 'Correo no encontrado'
            }) 
        }
        //console.log(result)
        const passwordCorrecto = await bcrypt.compare(password, result[0].usu_password)
        if(!passwordCorrecto) {
            return res.status(400).json({
                error: "Las contraseñas no coinciden"
            })
        }
        //Agregar JWT
        const accessToken = jwt.sign({
            username: result[0].usu_nombre,
            id: result[0].usu_nua,
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30m'
        })
        const refreshToken = jwt.sign({
            username: result[0].usu_nombre,
            id: result[0].usu_nua,
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.header('auth-token', accessToken).json ({
            error: null,
            role: process.env.USER,
            accessToken: accessToken
        })
    });
})

router.post('/registrousuario', async (req,res) => {
    const {nua, nombre, appat, apmat, email, password, telefono} = req.body
    const sql = "INSERT INTO usuario(usu_nua,usu_nombre,usu_ap_pat,usu_ap_mat,usu_correo,usu_password,usu_telefono) VALUES (?) ";
    const salt = await bcrypt.genSalt(10)
    const contrasenaNueva = await bcrypt.hash(password, salt)
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
        res.json({
            error: null,
            data: result
        })
    });
})

router.put('/actualizarusuario', async (req,res) => {
    const {nua, nombre, appat, apmat, email, password, telefono} = req.body
    const sql = 
        'UPDATE usuario ' +
            `SET usu_nombre = '${nombre}', usu_ap_pat = '${appat}', usu_ap_mat = '${apmat}', usu_correo = '${email}', usu_password = '${password}', usu_telefono = '${telefono}' ` +
            `WHERE usu_nua = '${nua}';`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Usuario Actualizado");
        res.json({
            error: null,
            data: result
        })
    });
})

router.delete('/eliminarusuario', async (req,res) => {
    const nua = req.body.nua;
    const sql = `DELETE FROM usuario WHERE usu_nua = (?)` ;
    connection.query(sql, [nua], function (err, result) {
        if (err) throw err;
        console.log(err);
        res.json({
            error: null,
            data: result
        })
    });
})

module.exports = router;