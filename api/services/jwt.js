'use strict'

// importar JWT
var jwt = require('jwt-simple');

// importar momentjs
var moment = require('moment');

// clave secreta
var secret = 'clave_secreta';

// crear y exportar el método de creación del token
exports.createToken = function(user) {
    // variable para los datos que vamos a codificar
    var payload = {
        sub: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    // devolver el token pasándole la clave secreta para que genere el hash según esa clave
    return jwt.encode(payload, secret);
}