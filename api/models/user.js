'use strict'

// cargo el modelo de mongoose para acceder a la BD
var mongoose = require('mongoose');

// defino la variable para definir esquemas o modelos de la BD.
// Esto nos permite crear objetos de tipo Schema que corresponde con una 
// coleccion de la BD
var Schema = mongoose.Schema;

// creo un esquema para nuestros usuarios
var UserSchema = Schema({

    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

// para utilizar este objeto fuera de este fichero tenemos que exportarlo.
// De esta forma, cuando utilicemos el Schema vamos a tener un objeto User
// con los valores de la BD
module.exports = mongoose.model('User', UserSchema);