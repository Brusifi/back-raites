const router = require('express').Router()
const bcrypt = require('bcrypt')
const connection = require('../config/conexion')

//CONDUCTORES
router.get('/verConductores', async (req,res) => {
    const sql = "SELECT * FROM conductor"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
            error: null,
            data: result
        })
    });
})

router.post('/registroConductor', async (req,res) => {
    const body = req.body
    const {nua, nombre, appat, apmat, email, password, telefono, placa, modelo,color} = req.body
    const sql = "INSERT INTO conductor(con_nua,con_nombre,con_ap_pat,con_ap_mat,con_correo, con_password,con_telefono,con_placa,con_modelo,con_color) VALUES (?) ";
    const salt = await bcrypt.genSalt(10)
    const contrasenaNueva = await bcrypt.hash(password, salt)
    const values = [
        nua,
        nombre, 
        appat, 
        apmat, 
        email, 
        contrasenaNueva, 
        telefono, 
        placa,
        modelo,
        color
    ]
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("1 conario insertado");
        res.json({
            error: null,
            data: result
        })
    });
})

router.post('/conductorlogin', async (req, res) => {
    const { email, password } = req.body
    const sql = `SELECT con_correo,con_password,con_nua,con_nombre FROM conductor WHERE con_correo = '${email}'`
    connection.query(sql, async function (err, result) {
        if (err) throw err;
        if(result.length === 0) {
            return res.status(400).json({
                error: 'Correo no encontrado'
            }) 
        }
        //console.log(result)
        const passwordCorrecto = await bcrypt.compare(password, result[0].con_password)
        if(!passwordCorrecto) {
            return res.status(400).json({
                error: "Las contraseñas no coinciden"
            })
        }
        //Agregar JWT
        const accessToken = jwt.sign({
            username: result[0].con_nombre,
            id: result[0].con_nua,
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30m'
        })
        const refreshToken = jwt.sign({
            username: result[0].con_nombre,
            id: result[0].con_nua,
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.header('auth-token', accessToken).json ({
            error: null,
            role: process.env.DRIVER,
            accessToken: accessToken
        })
    });
})

router.delete('/eliminarConductor/:con_nua', async (req,res) => {
    const con_nua = req.params.con_nua;
    const sql = `DELETE FROM conductor WHERE con_nua = (?)` ;
    connection.query(sql, [con_nua], function (err, result) {
        if (err) throw err;
        console.log(err);
        res.json({
            error: null,
            data: result
        })
    });
})

router.put('/actualizarConductor/:con_nua', async (req,res) => {
    const {nua, nombre, appat, apmat, email, password, telefono, placa, modelo, color} = req.body
    const sql = 
        'UPDATE conductor ' +
            `SET con_nombre = '${nombre}', con_ap_pat = '${appat}', con_ap_mat = '${apmat}', con_correo = '${email}', con_password = '${password}', con_telefono = '${telefono}', con_placa = '${placa}', con_modelo = '${modelo}', con_color = '${color}' ` +
            `WHERE con_nua = '${req.params.con_nua}';`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Conductor Actualizado");
        res.json({
            error: null,
            data: result
        })
    });
})

module.exports = router