'use strict'

// cargo las librerias de express y body-parser
var express = require('express');
var boyParser = require('body-parser');

// creao el objeto express
var app = express();

// cargo rutas
// cargar el fichero de rutas del controlador de usuarios
var user_routes = require('./routes/user');

//cargamos el fichero de rutas del controlador de equipo
var team_routes = require('./routes/team');

//cargamos el fichero de rutas del controlador de pilotos
var pilot_routes = require('./routes/pilot');

// configuro el body-parser
app.use(boyParser.urlencoded({ extended: false }));

// para convertir los datos que nos llegan por http a objetos json
app.use(boyParser.json());

// vamos a configurar las cabeceras http
app.use((req, res, next) => {
    // vamos a configurar las cabeceras

    // con esta propiedad permitimos el acceso a todos los dominios
    res.header('Access-Control-Allow-Origin', '*');

    // cabeceras para que el api funcione a nivel de Ajax
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');

    // permitir los metodos http mas comunes
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    //para salir del middleware y continuar con el flujo de ejecucion
    next();
});

// para cargar la ruta base
// detras de cada url con peticion /api cargaremos una peticion a la ruta de user
app.use('/api', user_routes);
app.use('/api', team_routes);
app.use('/api', pilot_routes);

// exporto el modulo
module.exports = app;