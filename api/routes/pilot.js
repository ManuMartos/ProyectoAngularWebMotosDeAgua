'use strict'

var express = require('express');

var PilotController = require('../controllers/pilot');

var md_auth = require('../middlewares/authenticated');

// modulo para subir y enviar ficheros
var multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: './uploads/pilots' });

// cargamos el router de express
var api = express.Router();

api.get('/pilot/:id', md_auth.ensureAuth, PilotController.getPilot);
api.post('/pilot', md_auth.ensureAuth, PilotController.savePilot);
api.get('/pilots/:page?', md_auth.ensureAuth, PilotController.getPilots);
api.put('/pilot/:id', md_auth.ensureAuth, PilotController.updatePilot);
api.delete('/pilot/:id', md_auth.ensureAuth, PilotController.deletePilot);
// Metedos para subir imagenes
api.post('/upload-image-pilot/:id', [md_auth.ensureAuth, md_upload], PilotController.uploadImage);
api.get('/get-image-pilot/:imageFile', PilotController.getImageFile);

// exportar la api para usarla fuera de este fichero
module.exports = api;