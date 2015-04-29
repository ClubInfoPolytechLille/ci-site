var MembreModl = require('../models/MembreModl');
var PolyUserServ = require('../services/PolyUserServ');
var async = require('async');

var MembresServ = {};

MembresServ.public = ['_id', 'login', 'role'];

MembresServ.simpleData = function (membreD, cb) {
    async.parallel([
        function (cba) {
            var membre = {};
            for (var prop of MembresServ.public) {
                membre[prop] = membreD[prop];
            }

            cba(null, membre);
        },
        function (cba) {
            PolyUserServ.get(membreD.login, cba);
        },
        function (cba) {
            MembresServ.estMembre(membreD.login, cba);
        },
        function (cba) {
            MembresServ.estBureau(membreD.login, cba);
        }
    ], function (err, res) {
        if (err) {
            cb(err);
        } else {
            membre = res[0];

            membre.nom = res[1].nom;
            membre.section = res[1].section;
            membre.membre = res[2];
            membre.bureau = res[3];
            cb(null, membre);
        }
    });
};

MembresServ.get = function (id, cb) {
    MembreModl.findById(id, cb);
};

MembresServ.getLogin = function (login, cb) {
    MembreModl.findOne({
        login: login
    }, cb);
};

MembresServ.list = function (cb) {
    MembreModl.find({
        $or: [{
            hidden: false
        }, {
            hidden: undefined
        }]
    }, cb);
};

MembresServ.assert = function (membre, cb) {

    cb(null, membre.login && membre.role);
};

MembresServ.add = function (data, cb) {

    MembreModl.create({
        login: data.login,
        role: data.role
    }, cb);
};

MembresServ.remove = function (id, cb) {
    MembreModl.remove({
        _id: id
    }, cb);
};

MembresServ.estMembre = function (login, cb) {
    MembreModl.findOne({
        login: login
    }, function (err, data) {
        if (!err && data) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    });
};

MembresServ.estBureau = function (login, cb) {
    MembreModl.findOne({
        login: login
    }, function (err, data) {
        if (!err && data && ['Président', 'Vice-président', 'Trésorier', 'Secrétaire'].indexOf(data.role) > -1) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    });
};

module.exports = MembresServ;
