var NomsModl = require('../models/NomsModl');
var LineTransform = require('node-line-reader').LineTransform;
var fs = require('fs');

var noms = {};

noms.readPasswd = function (login, cb) {
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
                    cb({
                        'username': ex[0],
                        'password': ex[1],
                        'UID': ex[2],
                        'GID': ex[3],
                        'GECOS': ex[4],
                        'home': ex[5],
                        'shell': ex[6]
                    });
                    found = true;
                }
            });
            transform.on('end', function () {
                if (!found) {
                    cb(false);
                }
            });
        } else {
            cb(undefined);
        }
    });
};

noms.readGroup = function (gid, cb) {
    groupF = 'config/group';
    fs.exists(groupF, function (exists) {
        found = false;
        if (exists) {
            stream = fs.createReadStream(groupF);
            transform = new LineTransform();
            stream.pipe(transform);
            transform.on('data', function (line) {
                ex = line.split(':');
                if (ex[2] == gid) { // Si trouvé
                    stream.close();
                    cb({
                        'name': ex[0],
                        'password': ex[1],
                        'GID': ex[2],
                        'list': ex[3]
                    });
                    found = true;
                }
            });
            transform.on('end', function () {
                if (!found) {
                    cb(false);
                }
            });
        } else {
            cb(undefined);
        }
    });
};

noms.get = function (login, cb) {
    NomsModl.findOne({
        login: login
    }, {
        nom: 1,
        section: 1,
        _id: 0
    }, function (err, nom) {
        if (nom && !err && nom.nom && nom.section) {
            cb(nom);
        } else {
            noms.readPasswd(login, function (passwd) {
                if (passwd) {
                    noms.readGroup(passwd.GID, function (group) {
                        if (group) {
                            cb({
                                nom: passwd.GECOS,
                                section: group.name.toUpperCase()
                            });
                            NomsModl.create({
                                login: login,
                                nom: passwd.GECOS,
                                section: group.name.toUpperCase()
                            });
                        } else {
                            if (group === undefined) {
                                console.error("Impossible d'ouvrir le fichier des groupes.");
                            } else {
                                console.error("Impossible d'obtenir le groupe de " + passwd.GID + ".");
                            }
                            cb({
                                nom: passwd.GECOS,
                                section: passwd.GID
                            });
                        }
                    });
                } else {
                    if (passwd === undefined) {
                        console.error("Impossible d'ouvrir le fichier des noms.");
                    } else {
                        console.error("Impossible d'obtenir le nom de " + login + ".");
                    }
                    cb({
                        nom: login.toUpperCase(),
                        section: 'Inconnue'
                    });
                }
            });
        }
    });
};

module.exports = noms;
