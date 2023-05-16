const router = require('express').Router()
const connection = require('../config/conexion')

router.get('/verDetalle', async (req,res) => {
    const sql = "SELECT * FROM detalle"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
            error: null,
            data: result
        })
    });
})

router.post('/registrarDetalle', async (req,res) => {
    const body = req.body
    const {via_id, usu_nua, estatus} = req.body
    const sql = "INSERT INTO detalle(det_via_id, det_usu_nua, det_estatus) VALUES (?) ";
    const values = [
        via_id, usu_nua, estatus
    ]
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("1 detalle insertado");
        res.json({
            error: null,
            data: result
        })
});
})

router.put('/actualizarDetalle/:via_id/:usu_nua', async (req,res) => {
    const {estatus} = req.body
    const sql = 
        'UPDATE detalle ' +
            `SET det_estatus = '${estatus}' ` +
            `WHERE (det_via_id = '${req.params.via_id}' AND det_usu_nua = '${req.params.usu_nua}');`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Detalle Actualizado");
        res.json({
            error: null,
            data: result
        })
    });
})

router.delete('/eliminarDetalle/:via_id/:usu_nua', async (req,res) => {
    const sql = `DELETE FROM detalle WHERE (det_via_id = '${req.params.via_id}' AND det_usu_nua = '${req.params.usu_nua}');` ;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(err);
        res.json({
            error: null,
            data: result
        })
    });
})

module.exports = router