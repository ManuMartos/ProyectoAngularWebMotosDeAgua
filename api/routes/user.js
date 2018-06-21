'use strict'

var express = require('express');

var UserController = require('../controllers/user');

var md_auth = require('../middlewares/authenticated');

// módulo para subida y envío de ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

// cargar el router de express
var api = express.Router();

api.get('/probando', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

// exportar la api para poder utilizarla fuera de este fichero y así todas las rutas funcionen en el backend
module.exports = api;