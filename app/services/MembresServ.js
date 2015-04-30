var MembreModl = require('../models/MembreModl');
var PolyUserServ = require('../services/PolyUserServ');
var async = require('async');

var MembresServ = module.exports = {

    public: ['_id', 'login', 'role'],

    simpleData: function (membreD, cb) {
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
    },

    get: function (id, cb) {
        MembreModl.findById(id, cb);
    },

    getLogin: function (login, cb) {
        MembreModl.findOne({
            login: login
        }, cb);
    },

    list: function (cb) {
        MembreModl.find({
            $or: [{
                hidden: false
            }, {
                hidden: undefined
            }]
        }, cb);
    },

    assert: function (membre, cb) {

        cb(null, membre.login && membre.role);
    },

    add: function (data, cb) {

        MembreModl.create({
            login: data.login,
            role: data.role
        }, cb);
    },

    remove: function (id, cb) {
        MembreModl.remove({
            _id: id
        }, cb);
    },

    estMembre: function (login, cb) {
        MembreModl.findOne({
            login: login
        }, function (err, data) {
            if (!err && data) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        });
    },

    estBureau: function (login, cb) {
        MembreModl.findOne({
            login: login
        }, function (err, data) {
            if (!err && data && ['Président', 'Vice-président', 'Trésorier', 'Secrétaire'].indexOf(data.role) > -1) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        });
    }
};
