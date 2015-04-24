var LineTransform = require('node-line-reader').LineTransform;
var fs = require('fs');
var Client = require('ssh2').Client;
var creds = require('../../config/sshAuth');
var NodeCache = require("node-cache");

var cache = new NodeCache({
    stdTTL: 24 * 60 * 60
});

var PolyUserServ = {};

PolyUserServ.readPasswd = function (login, cb) {
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

PolyUserServ.readGroup = function (gid, cb) {
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

PolyUserServ.grabInfos = function (login, cb) {
    PolyUserServ.readPasswd(login, function (passwd) {
        if (passwd) {
            PolyUserServ.readGroup(passwd.GID, function (group) {
                if (group) {
                    cb({
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
            if (!login) {
                login = 'Inconnu';
            }
            cb({
                nom: login.toUpperCase(),
                section: 'Inconnue'
            });
        }
    });
};

PolyUserServ.add = function (login, cb) {
    PolyUserServ.grabInfos(login, function (data) {
        cb(null, data);
        cache.set(login, data);
    });
};

PolyUserServ.get = function (login, cb) {
    cache.get(login, function (err, data) {
        if (err) {
            cb(err);
        } else {
            if (data) {
                cb(null, data);
            } else {
                PolyUserServ.add(login, cb);
            }
        }
    });
};

PolyUserServ.verify = function (login, pass, cb) {
    var conn = new Client();
    conn.on('ready', function () {
        cb(null, true);
    }).on('error', function (err) {
        if (err.level === 'client-authentication') {
            cb(null, false);
        } else {
            cb(err);
        }
    }).connect({
        host: creds.host,
        port: creds.port,
        username: login,
        password: pass
    });
};

module.exports = PolyUserServ;
