var MembreModl = require('../models/MembreModl');
var NomsServ = require('../services/NomsServ');
var async = require('async');

var membres = {};

membres.list = function (cb) {
    MembreModl.find({}).lean().exec(function (err, membres) {
        addNom = function (membre, cbA) {
            NomsServ.get(membre.login, function (nom) {
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
    MembreModl.create({
        login: data.login,
        role: data.role,
        section: data.section,
    }, cb);
};

membres.remove = function (id, cb) {
    MembreModl.remove({
        _id: id
    }, cb);
};

module.exports = membres;
