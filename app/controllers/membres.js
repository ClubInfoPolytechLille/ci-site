var Membre = require('../models/membre');
var noms = require('../controllers/noms');
var async = require('async');

var membres = {};

membres.list = function (cb) {
    Membre.find({}).lean().exec(function (err, membres) {
        addNom = function (membre, cbA) {
            noms.get(membre.login, function (nom) {
                if (nom) {
                    membre.nom = nom;
                } else {
                    membre.nom = membre.login;
                }
                cbA(null, membre);
            });
        };
        async.mapSeries(membres, addNom, cb);
    });
};

membres.add = function (data, cb) {
    Membre.create({
        login: data.login,
        role: data.role,
        section: data.section,
    }, cb);
};

membres.remove = function (id, cb) {
    Membre.remove({
        _id: id
    }, cb);
};

module.exports = membres;
