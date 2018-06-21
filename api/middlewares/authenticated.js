'use strict'

// importamos jwt
var jwt = require('jwt-simple');

// importamos moment
var moment = require('moment');

// clave secreta
var secret = 'clave_secreta';

// método para comprobar si el token es correcto
// recibe la petición http del cliente y el next para salir de este middleware
exports.ensureAuth = function(req, res, next) {
    // recoger la autorización, pasándola por la cabecera
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La petición no tiene la cabecera de autentificación' });
    }

    // si tenemos el campo en la cabecera, quitar las comillas por delante y por detrás
    var token = req.headers.authorization.replace(/['"]+/g, '');

    // decodificar el token
    try {
        var payload = jwt.decode(token, secret);

        // si la fecha de expiración es menor que la actual
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'El token ha expirado' });
        }
    } catch (ex) {
        console.log(ex);
        return res.status(404).send({ message: 'Token no válido' });
    }

    // propiedad del request de tipo userva ha estar disponible en cada uno de los métodos que utilicen este middleware. El user tiene todos los datos del usuario identificado
    req.user = payload;

    // salir del middleware
    next();
}