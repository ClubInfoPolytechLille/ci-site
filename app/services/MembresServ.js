var MembreModl = require('../models/MembreModl');
var NomsServ = require('../services/NomsServ');
var async = require('async');

var MembresServ = {};

MembresServ.addData = function (membre, cb) {
    NomsServ.get(membre.login, function (nom) {
        membre.nom = nom.nom;
        membre.section = nom.section;
        cb(null, membre);
    });
};

MembresServ.get = function (id, cb) {
    MembreModl.findById(id).lean().exec(function (err, membre) {
        if (err)
            cb(err);
        else
            MembresServ.addData(membre, cb);
    });
};

MembresServ.list = function (cb) {
    MembreModl.find({}).lean().exec(function (err, membres) {
        async.mapSeries(membres, MembresServ.addData, cb);
    });
};

MembresServ.add = function (data, cb) {
    MembreModl.create({
        login: data.login,
        role: data.role,
        section: data.section,
    }, function (err, membre) {
        MembresServ.get(membre._id, cb);
    });
};

MembresServ.remove = function (id, cb) {
    MembreModl.remove({
        _id: id
    }, cb);
};

MembresServ.estBureau = function (login, cb) {
    MembreModl.findOne({
        login: login
    }, function (err, data) {
        if (!err && data && data.role != 'Membre') {
            cb(true);
            console.log(true);
        } else {
            cb(false);
            console.log(false);
        }
    });
};

module.exports = MembresServ;
