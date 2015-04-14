var ConvModl = require('../models/ConvModl');
// var PolyUserServ = require('../services/PolyUserServ');
var async = require('async');

var ConvsServ = {};

ConvsServ.addData = function (conv, cb) {
    // PolyUserServ.get(Conv.login, function (err, nom) {
    //     if (nom) {
    //         Conv.nom = nom;
    //     } else {
    //         Conv.nom = Conv.login;
    //     }
    //     cb(null, Conv);
    // });
    // TODO Démarré par
    // TODO Dernier message
    cb(null, conv);
};

ConvsServ.exists = function (id, cb) {
    ConvModl.findById(id).exec(function (err, conv) {
        if (err)
            cb(err);
        else
            cb(null, true);
    });
};

ConvsServ.get = function (id, cb) {
    ConvModl.findById(id).lean().exec(function (err, conv) {
        if (err)
            cb(err);
        else
            ConvsServ.addData(conv, cb);
    });
};

ConvsServ.list = function (cb) { // TODO Visibilité
    ConvModl.find({}).lean().exec(function (err, Convs) {
        async.mapSeries(Convs, ConvsServ.addData, cb);
    });
};

ConvsServ.children = function (id, cb) {
    ConvModl.find({
        parent: id
    }).lean().exec(function (err, Conv) {
        async.mapSeries(Conv, ConvsServ.addData, cb);
    });
};

ConvsServ.add = function (data, cb) {
    ConvModl.create({
        titre: data.titre,
        parent: data.parent
    }, function (err, Conv) {
        ConvsServ.get(Conv._id, cb);
    });
};

ConvsServ.canWriteIn = function (id, login, cb) {
    ConvsServ.exists(id, cb);
};

ConvsServ.remove = function (id, cb) {
    // TODO Trash
    ConvModl.remove({
        _id: id
    }, cb);
};

module.exports = ConvsServ;
