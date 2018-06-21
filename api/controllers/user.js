'use strict'

// importamos el modelo de usuario
var User = require('../models/user');

// importar la librería bcrypt para encritar contraseñas
var bcrypt = require('bcrypt-nodejs');

// importar el servicio de jwt
var jwt = require('../services/jwt');

// trabajar con el sistema de ficheros
var fs = require('fs');

// trabajar con rutas del sistema
var path = require('path');

function saveUser(req, res) {
    // crear un objeto usuario
    var user = new User();

    // obtenemos todos los parámetros que nos llegan en la petición http
    var params = req.body;

    console.log(params);

    // set de cada uno de los atributos
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        // encriptar la contraseña y guardar los datos

        // utilizar un metodo hash del objeto bcrypt
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                // guardar al usuario en la bd
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    } else {
                        // comprobar que el usuario se haya guardado correctamente
                        if (!userStored) {
                            res.status(400).send({ message: 'Error en el registro de usuario' });
                        } else {
                            res.status(200).send({ user: userStored });
                        }
                    }
                });
            }
        });
    } else {
        res.status(500).send({ message: 'Introduce la contraseña' });
    }
}

// comprobar si el email y el password existen y son correctos en la base de datos
function loginUser(req, res) {
    // recogemos los parámetros de la petición del usuario y con body-parser los convertiremos en json
    var params = req.body;

    var email = params.email;
    var password = params.password;

    // find sobre la BD utilizando User
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!user) {
                res.status(400).send({ message: 'El usuario no existe' });
            } else {
                // comprobar la password
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        // devolver los datos del usuario logeado
                        if (params.gethash) {
                            // devuelve un token generado por JWT con el objeto del usuario (todos los datos del usuario) que usaremos en todas las peticiones que hagamos a la api REST y así, de esta forma controlamos que el usuario esté o no identificado.
                            // Además, vamos a crear un servicio de JWT para crear los tokens y un middleware para comprobar en cada una de las rutas si el token que llega en la petición es correcto
                            res.status(200).send({ token: jwt.createToken(user) });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({ message: 'El usuario no se ha podido logear' });
                    }
                });
            }
        }
    });
}

function pruebas(req, res) {
    res.status(200).send({ message: 'Probando el controlador de Usuario' });
}

function updateUser(req, res) {
    // recogemos el id del usuario a actualizar
    var userId = req.params.id;

    // guardar el body de la petición http put
    var update = req.body;

    // comprobar si el userId que nos llega es igual al del token
    // ojo, que en el payload "services/jwt.js" el campo user.id se llama sub
    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tiene permisos para actualizar al usuario' });
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar al usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
}

function uploadImage(req, res) {
    // recogemos il id el usuario
    var userId = req.params.id;

    // variable para el fichero
    var file_name = 'No encontrado';

    // si en la petición viene el fichero, hacemos la subida
    if (req.files) {
        var file_path = req.files.image.path;

        // tratar el path del fichero para conseguir el nombre
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        // recortar para sacar la extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // comprobar si la extensión es correcta
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error en la petición' });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar al usuario' });
                    } else {
                        res.status(200).send({ image: file_name, user: userUpdated });
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'Extensión Incorrecta' });
        }

        console.log(file_path);
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna imagen' });
    }
}

function getImageFile(req, res) {
    // obtenemos del request el nombre del fichero
    var imageFile = req.params.imageFile;
    // ruta del fichero
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            // respuesta http enviando el fichero que acabamos de resolver con el path de la ruta
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}

// Para poder utilizar las funciones en una ruta fuera del fichero
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}