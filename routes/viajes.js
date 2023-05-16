const router = require('express').Router()
const connection = require('../config/conexion')

router.get('/verViajes', async (req,res) => {
    const sql = "SELECT * FROM viaje"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
            error: null,
            data: result
        })
    });
})

router.post('/registrarViaje', async (req,res) => {
    const body = req.body
    const {inicio, destino, fec_salida, hor_salida, costo, met_pago, con_nua} = req.body
    const sql = "INSERT INTO viaje(via_lugar_inicio, via_lugar_destino, via_fecha_salida, via_hora_salida, via_costo, via_metodo_pago, via_con_nua) VALUES (?) ";
    const values = [
        inicio, destino, fec_salida, hor_salida, costo, met_pago, con_nua
    ]
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("1 Viaje insertado");
        res.json({
            error: null,
            data: result
        })
});
})

router.put('/actualizarViaje/:via_id', async (req,res) => {
    const {inicio, destino, fec_salida, hor_salida, costo, met_pago, con_nua} = req.body
    const sql = 
        'UPDATE viaje ' +
            `SET via_lugar_inicio = '${inicio}', via_lugar_destino = '${destino}', via_fecha_salida = '${fec_salida}', via_hora_salida = '${hor_salida}', via_costo = '${costo}', via_metodo_pago = '${met_pago}', via_con_nua = '${con_nua}' ` +
            `WHERE via_id = '${req.params.via_id}';`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Viaje Actualizado");
        res.json({
            error: null,
            data: result
        })
    });
})

router.delete('/eliminarViaje/:via_id', async (req,res) => {
    const via_id = req.params.via_id;
    const sql = `DELETE FROM viaje WHERE via_id = (?)` ;
    connection.query(sql, [via_id], function (err, result) {
        if (err) throw err;
        console.log(err);
        res.json({
            error: null,
            data: result
        })
    });
})

module.exports = router