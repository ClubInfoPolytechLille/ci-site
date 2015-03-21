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
                found = false
                stream = fs.createReadStream('config/passwd')
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
                transform.on('error', function (e) {
                    console.error("Error while fetching name", e)
                    cb(login.toUpperCase())
                })
            }
        }
    })
}

module.exports = noms;