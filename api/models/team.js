'use strict'

// cargar el modelo de mongoose para acceder a la BD
var mongoose = require('mongoose');

// variable para definir esquemas o modelos de la BD. Esto permite crear objetos de tipo Schema que corresponden con una colección de la BD
var Schema = mongoose.Schema;

// crear un esquema para nuestros equipos
var TeamSchema = Schema({
    name: String,
    description: String,
    image: String
});

// para utilizar este objeto fuera de este fichero tenemos que exportarlo.De esta forma, cuando utilicemos el Schema vamos a tener un objeto User con los valores de la BD
module.exports = mongoose.model('Team', TeamSchema);