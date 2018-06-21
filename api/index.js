'use strict'

var mongoose = require('mongoose');
var app = require('./app');

// configuro el servidor web nodeJS
var port = process.env.PORT || 3977;


mongoose.connect('mongodb://localhost:27017/web-campeonato', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("Conexion correcta");

        // pongo el servidor a escuchar
        app.listen(port, function() {

            console.log("Servidor escuchando en http://localhost:" + port);
        })
    }
});