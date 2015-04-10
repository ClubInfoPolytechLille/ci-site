var MessModl = require('../models/MessModl');
// var NomsServ = require('../services/NomsServ');
var ConvsServ = require('../services/ConvsServ');
var async = require('async');

var MesssServ = {};

MesssServ.addData = function (mess, cb) {
    // NomsServ.get(Mess.login, function (nom) {
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

MesssServ.remove = function (id, cb) {
    // TODO Trash
    MessModl.remove({
        _id: id
    }, cb);
};

module.exports = MesssServ;