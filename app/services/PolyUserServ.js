var fs = require('fs');
var async = require('async');
var Client = require('ssh2').Client;
var creds = require('../../config/sshAuth');
var NodeCache = require("node-cache");

var cache = new NodeCache({
    stdTTL: 24 * 60 * 60
});

var PolyUserServ = module.exports = {

    readPasswd: function (login, cb) {
        passwdF = 'config/passwd';
        fs.readFile(passwdF, function (err, file) {
            if (err) {
                cb(err);
            } else {
                lines = file.toString('utf8').split('\n');
                async.detect(lines, function (line, cba) {
                    ex = line.split(':');
                    cba(ex[0] == login);
                }, function (res) {
                    if (res) {
                        ex = res.split(':');
                        cb(null, {
                            'username': ex[0],
                            'password': ex[1],
                            'UID': ex[2],
                            'GID': ex[3],
                            'GECOS': ex[4],
                            'home': ex[5],
                            'shell': ex[6]
                        });
                    } else {
                        cb(null, null);
                    }
                });
            }
        });
    },

    readGroup: function (gid, cb) {
        groupF = 'config/group';
        fs.readFile(groupF, function (err, file) {
            if (err) {
                cb(err);
            } else {
                lines = file.toString('utf8').split('\n');
                async.detect(lines, function (line, cba) {
                    ex = line.split(':');
                    cba(ex[2] == gid);
                }, function (res) {
                    if (res) {
                        ex = res.split(':');
                        cb(null, {
                            'name': ex[0],
                            'password': ex[1],
                            'GID': ex[2],
                            'list': ex[3]
                        });
                    } else {
                        cb(null, null);
                    }
                });
            }
        });
    },

    grabInfos: function (login, cb) {
        async.waterfall([
            function (cba) {
                PolyUserServ.readPasswd(login, cba);
            },
            function (passwd, cba) {
                if (passwd && passwd.GID) {
                    PolyUserServ.readGroup(passwd.GID, function (err, group) {
                        cba(err, passwd, group);
                    });
                } else {
                    cba(null, passwd, null);
                }
            }
        ], function (err, passwd, group) {
            if (err) {
                cb(err);
            } else {
                cb(null, {
                    nom: (passwd && passwd.GECOS) ? passwd.GECOS : login.toUpperCase(),
                    section: (group && group.name) ? group.name.toUpperCase() : ((passwd && passwd.GID) ? passwd.GID : 'Inconnu')
                });
            }
        });
    },

    add: function (login, cb) {
        PolyUserServ.grabInfos(login, function (err, data) {
            if (err) {
                cb(err);
            } else {
                cb(null, data);
                cache.set(login, data);
            }
        });
    },

    get: function (login, cb) {
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
    },

    verify: function (login, pass, cb) {
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
    }
};
