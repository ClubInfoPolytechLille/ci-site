var NomsModl = require('../models/NomsModl');
var LineTransform = require('node-line-reader').LineTransform;
var fs = require('fs');

var noms = {};

noms.get = function (login, cb) {
    NomsModl.findOne({
        login: login
    }, function (err, nom) {
        if (err) {
            console.error(err);
            cb(false);
        } else {
            if (nom) {
                cb(nom.nom);
            } else {
                passwdF = 'config/passwd';
                fs.exists(passwdF, function (exists) {
                    found = false;
                    if (exists) {
                        stream = fs.createReadStream(passwdF);
                        transform = new LineTransform();
                        stream.pipe(transform);
                        transform.on('data', function (line) {
                            ex = line.split(':');
                            if (ex[0] == login) { // Si trouvé
                                stream.close();
                                cb(ex[4]);
                                found = true;
                                NomsModl.create({
                                    login: login,
                                    nom: ex[4]
                                });
                            }
                        });
                        transform.on('end', function () {
                            if (!found) {
                                cb(false);
                            }
                        });
                    } else {
                        console.error("Impossible de trouver le fichier passwd");
                        cb(login.toUpperCase());
                    }
                });
            }
        }
    });
};

module.exports = noms;
