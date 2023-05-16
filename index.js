const express = require('express')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const bodyParser = require('body-parser')
require('dotenv').config()
const PORT = process.env.PORT || 12000
const app = express()

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const rutas_usuarios = require('./routes/usuarios')
app.use('/', rutas_usuarios)

const rutas_conductores = require('./routes/conductores')
app.use('/', rutas_conductores)

const rutas_viajes = require('./routes/viajes')
app.use('/', rutas_viajes)

const rutas_detalle = require('./routes/detalle')
app.use('/', rutas_detalle)

app.listen(PORT, () => {
    console.log(`Escuchando Puerto: ${PORT}`)
})