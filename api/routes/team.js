'use strict'

var express = require('express');

var TeamController = require('../controllers/team');

var md_auth = require('../middlewares/authenticated');

// módulo para subida y envío de ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/teams' });

// cargar el router de express
var api = express.Router();

api.get('/team/:id', md_auth.ensureAuth, TeamController.getTeam);
api.post('/team', md_auth.ensureAuth, TeamController.saveTeam);
api.get('/teams/:page?', md_auth.ensureAuth, TeamController.getTeams);
api.put('/team/:id', md_auth.ensureAuth, TeamController.updateTeam);
api.delete('/team/:id', md_auth.ensureAuth, TeamController.deleteTeam);
api.post('/upload-image-team/:id', [md_auth.ensureAuth, md_upload], TeamController.uploadImage);
api.get('/get-image-team/:imageFile', TeamController.getImageFile);

// exportar la api para poder utilizarla fuera de este fichero y así todas las rutas funcionen en el backend
module.exports = api;