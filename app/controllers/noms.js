var Noms = require('../models/noms');
var lineReader = require('line-reader');

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
                try {
                    lineReader.eachLine('config/passwd', function (line, last, cbL) {
                        ex = line.split(':')
                        // console.log(ex);
                        if (ex[0] == login) { // Si trouvé
                            found = true
                            cb(ex[4])
                            cbL(false);
                        } else {
                            cbL();
                        }
                    }).then(function () {
                        if (!found) {
                            cb(false)
                        }
                    });
                } catch (e) {
                    console.error("Error while fetching name", e)
                    cb(login.toUpperCase())
                }
            }
        }
    })
}

module.exports = noms;