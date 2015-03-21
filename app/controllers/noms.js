var Noms = require('../models/noms');
var LineTransform = require('node-line-reader').LineTransform;
var fs = require('fs')

var noms = {}

noms.get = function (login, cb) {
    Noms.find({
        login: login
    }, function (err, nom) {
        if (err) {
            console.error(err)
            cb(false)
        } else {
            if (nom.length >= 1) {
                cb(nom.nom)
            } else {
                passwdF = 'config/passwd'
                fs.exists(passwdF, function (exists) {
                    found = false
                    if (exists) {
                        stream = fs.createReadStream(passwdF)
                        transform = new LineTransform()
                        stream.pipe(transform)
                        transform.on('data', function (line) {
                            ex = line.split(':')
                            if (ex[0] == login) { // Si trouvé
                                found = true
                                cb(ex[4])
                            }
                        })
                        transform.on('end', function () {
                            if (!found) {
                                cb(false)
                            }
                        })
                    } else {
                        console.error("Impossible de trouver le fichier passwd")
                        cb(login.toUpperCase())
                    }
                })
            }
        }
    })
}

module.exports = noms;