'use strict'

var path = require('path');
var fs = require('fs');

var Team = require('../models/team');
var Pilot = require('../models/pilot');

// para la paginacion
var mongoosePaginate = require('mongoose-pagination');

function getPilot(req, res) {
    // para obtener el id del piloto
    var pilotId = req.params.id;

    // metodo populate para obtener los datos del equipo asociado con el piloto, con la variable path le indicamos la 
    //propiedad donde almacenar los datos
    Pilot.findById(pilotId).populate({ path: "pilot" }).exec((err, pilot) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!pilot) {
                res.status(404).send({ message: 'No existe el piloto' });
            } else {
                res.status(200).send({ pilot });
            }
        }
    });
}

function getPilots(req, res) {
    // obtenemos de la peticion la pagina a mostrar
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    // variable para indicar los equipos por pagina vamos a mostrar
    var itemsPerPage = 4;

    Pilot.find().sort('name').paginate(page, itemsPerPage, function(err, pilots, total) {
        if (err) {
            res.status(500).send({ message: 'Error al listar los pilotos' });
        } else {
            if (!pilots) {
                res.status(404).send({ message: 'No hay pilotos' });
            } else {
                res.status(200).send({ pages: total, pilots: pilots });
            }
        }
    });
}

function savePilot(req, res) {
    // creamos el objeto piloto
    var piloto = new Pilot();

    var params = req.body;

    piloto.name = params.name;
    piloto.description = params.description;
    piloto.year = params.year;
    piloto.image = 'null';
    piloto.team = params.team;

    piloto.save((err, pilotStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!pilotStored) {
                res.status(404).send({ message: 'No se ha guardado al piloto' });
            } else {
                res.status(200).send({ pilot: pilotStored });
            }
        }
    });
}

function getPilots(req, res) {
    // obtenemos el id del equipo
    var teamId = req.params.team;

    if (!teamId) {
        // obtenemos todos los pilotos de la bd
        var find = Pilot.find({}).sort('name');
    } else {
        var find = Pilot.find({ team: teamId }).sort('name');
    }

    find.populate({ path: 'team' }).exec((err, pilots) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!pilots) {
                res.status(404).send({ message: 'No hay jugadores' });
            } else {
                res.status(200).send({ pilots });
            }
        }
    });
}

function updatePilot(req, res) {
    // obtenemos el id del piloto a actualizar
    var pilotId = req.params.id;

    var update = req.body;

    Pilot.findByIdAndUpdate(pilotId, update, (err, pilotUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!pilotUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar al piloto' });
            } else {
                res.status(200).send({ pilot: pilotUpdated });
            }
        }
    });
}

function deletePilot(req, res) {
    // obtenemos el id del piloto
    var pilotId = req.params.id;

    Pilot.findByIdAndRemove(pilotId, (err, pilotRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!pilotRemoved) {
                res.status(404).send({ message: 'No se ha podido borrar al piloto' });
            } else {
                res.status(200).send({ pilot: pilotRemoved });
            }
        }
    });
}

function uploadImage(req, res) {
    // recogemos el id del usuario que nos llega en el request
    var pilotId = req.params.id;

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

            Pilot.findByIdAndUpdate(pilotId, { image: file_name }, (err, pilotUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error en la peticion' });
                } else {
                    if (!pilotUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar el piloto' });
                    } else {
                        res.status(200).send({ pilot: pilotUpdated });
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
    var path_file = './uploads/pilots/' + imageFile;

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
    getPilot,
    savePilot,
    getPilots,
    updatePilot,
    deletePilot,
    uploadImage,
    getImageFile
}