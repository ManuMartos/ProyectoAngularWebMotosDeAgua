'use strict'

// cargo el modelo de mongoose para acceder a la BD
var mongoose = require('mongoose');

// defino la variable para definir esquemas o modelos de la BD.
// Esto nos permite crear objetos de tipo Schema que corresponde con una 
// coleccion de la BD
var Schema = mongoose.Schema;

// creo un esquema para nuestros pilotos
var PilotSchema = Schema({

    name: String,
    description: String,
    year: Number,
    image: String,
    team: { type: Schema.ObjectId, ref: 'Team' }
});

// para utilizar este objeto fuera de este fichero tenemos que exportarlo.
// De esta forma, cuando utilicemos el Schema vamos a tener un objeto User
// con los valores de la BD
module.exports = mongoose.model('Pilot', PilotSchema);