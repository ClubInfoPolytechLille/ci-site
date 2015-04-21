var MessModl = require('../models/MessModl');
// var PolyUserServ = require('../services/PolyUserServ');
var ConvsServ = require('../services/ConvsServ');
var async = require('async');

var MesssServ = {};

MesssServ.addData = function (mess, cb) {
    mess.auteur = {};
    mess.auteur.nom = mess.login;
    // PolyUserServ.get(Mess.login, function (err, nom) {
    //     if (nom) {
    //         Mess.nom = nom;
    //     } else {
    //         Mess.nom = Mess.login;
    //     }
    //     cb(null, Mess);
    // });
    cb(null, mess);
};

MesssServ.get = function (id, cb) {
    MessModl.findById(id).lean().exec(function (err, mess) {
        if (err)
            cb(err);
        else
            MesssServ.addData(mess, cb);
    });
};

MesssServ.list = function (conv, cb) {
    MessModl.find({
        conv: conv
    }).lean().exec(function (err, Messs) {
        async.mapSeries(Messs, MesssServ.addData, cb);
    });
};

MesssServ.add = function (data, cb) {
    ConvsServ.canWriteIn(data.conv, data.login, function (err, canWriteIn) {
        if (err)
            cb(err);
        else {
            if (canWriteIn) {
                MessModl.create({
                    content: data.content,
                    login: data.login,
                    conv: data.conv
                }, function (err, Mess) {
                    MesssServ.get(Mess._id, cb);
                });
            } else {
                cb('unauthorized');
            }
        }
    });
};

MesssServ.edit = function (data, cb) {
    MessModl.findById(data._id, function (err, mess) {
        if (err) {
            cb(err);
        } else {
            if (mess) {
                mess.content = data.content;
                // TODO Edit date
                mess.save(cb);
            } else {
                cb('notfound');
            }
        }
    });
};

MesssServ.remove = function (id, cb) {
    // TODO Trash
    MessModl.remove({
        _id: id
    }, cb);
};

module.exports = MesssServ;
