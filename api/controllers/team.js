'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

// cargamos los modelos

var Pilot = require('../models/pilot');
var Team = require('../models/team');


function saveTeam(req, res) {
    // vamos a crear un objeto Team vacio
    var team = new Team();

    // vamos a obtener los parametros de la peticion
    var params = req.body;

    // hacemos set a los atributos del team
    team.name = params.name;
    team.description = params.description;
    team.image = 'null';

    // ahora guardamos al equipo
    team.save((err, teamStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el equipo' });
        } else {
            if (!teamStored) {
                res.status(404).send({ message: 'El equipo no se ha guardado' });
            } else {
                res.status(200).send({ team: teamStored });
            }
        }
    });
}

function getTeam(req, res) {
    // obtenemos el id del equipo
    var teamId = req.params.id;

    Team.findById(teamId, (err, team) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener el equipo' });
        } else {
            if (!team) {
                res.status(404).send({ message: 'El equipo no existe' });
            } else {
                res.status(200).send({ team });
            }
        }
    });
}

function getTeams(req, res) {
    // obtenemos de la peticion la pagina a mostrar
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    // variable para indicar los equipos por pagina vamos a mostrar
    var itemsPerPage = 4;

    Team.find().sort('name').paginate(page, itemsPerPage, function(err, teams, total) {
        if (err) {
            res.status(500).send({ message: 'Error al listar los equipos' });
        } else {
            if (!teams) {
                res.status(404).send({ message: 'No hay equipos' });
            } else {
                res.status(200).send({ pages: total, teams: teams });
            }
        }
    });
}

function updateTeam(req, res) {
    // vamos a obtener el id del equipo
    var teamId = req.params.id;

    // vamos a obtener los datos del equipo para poder actualizarlo
    var update = req.body;

    Team.findByIdAndUpdate(teamId, update, (err, teamUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el equipo' });
        } else {
            if (!teamUpdated) {
                res.status(404).send({ message: 'El equipo no se ha actualizado' });
            } else {
                res.status(200).send({ team: teamUpdated });
            }
        }
    });
}

function deleteTeam(req, res) {
    // vamos a obtener del equipo a borrar
    var teamId = req.params.id;

    Team.findByIdAndRemove(teamId, (err, teamRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al borrar el equipo' });
        } else {
            if (!teamRemoved) {
                res.status(404).send({ message: 'El equipo no se ha borrado' });
            } else {
                Pilot.find({ team: teamRemoved._id }).remove((err, pilotRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al borrar el piloto' });
                    } else {
                        if (!pilotRemoved) {
                            res.status(404).send({ message: 'El piloto no se ha borrado' });
                        } else {
                            res.status(200).send({ team: teamRemoved });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    // recogemos el id del usuario que nos llega en el request
    var teamId = req.params.id;

    // variable para el fichero
    var file_name = 'No encontrado';

    // si en la peticion viene el fichero, hacemos la subida
    if (req.files) {
        var file_path = req.files.image.path;

        // tratamos el path del fichero para conseguir el nombre
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        // vamos a recortar para sacar la extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // ahora comprobamos si la extension es correcta
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            Team.findByIdAndUpdate(teamId, { image: file_name }, (err, teamUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error en la peticion' });
                } else {
                    if (!teamUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar al equipo' });
                    } else {
                        res.status(200).send({ team: teamUpdated });
                    }
                }
            });

        } else {
            res.status(200).send({ message: 'Extension incorrecta' });
        }

        console.log(file_path);
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna imagen' });
    }
}

function getImageFile(req, res) {
    // obtenemos del request el nombre del fichero
    var imageFile = req.params.imageFile;
    // sacamos la ruta del fichero
    var path_file = './uploads/teams/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            // si exixte la imagen, respuesta http enviando el fichero que acabamos de resolver con el path de la ruta
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No exixte la imagen' });
        }
    });
}

module.exports = {
    saveTeam,
    getTeam,
    getTeams,
    updateTeam,
    deleteTeam,
    uploadImage,
    getImageFile
}