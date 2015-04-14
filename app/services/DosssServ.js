var DossModl = require('../models/DossModl');
// var PolyUserServ = require('../services/PolyUserServ');
var async = require('async');

var DosssServ = {};

(function init() {
    DossModl.find({
        special: 'root'
    }).exec(function (err, data) {
        if (data.length < 1) {
            DossModl.create({
                special: 'root',
                titre: 'Racine'
            });
        }
    });
})();

DosssServ.addData = function (doss, cb) {
    // PolyUserServ.get(Doss.login, function (err, nom) {
    //     if (nom) {
    //         Doss.nom = nom;
    //     } else {
    //         Doss.nom = Doss.login;
    //     }
    //     cb(null, Doss);
    // });
    // TODO Dernier message
    cb(null, doss);
};

DosssServ.exists = function (id, cb) {
    DossModl.findById(id).exec(function (err, doss) {
        if (err)
            cb(err);
        else
            cb(null, true);
    });
};

DosssServ.getId = function (special, cb) {
    DossModl.findById(special).exec(function (err, doss) {
        if (!err && doss) {
            cb(doss._id); // Équivalent à cb(special)
        } else {

            DossModl.findOne({
                special: special
            }).exec(function (err2, doss) {
                if (!err2 && doss) {
                    cb(doss._id);
                } else {
                    cb(null);
                }
            });
        }
    });
};

DosssServ.get = function (special, cb) {
    DosssServ.getId(special, function (id) { // TODO À enlever avec api.get('/dosss/:doss_id')
        DossModl.findById(id).lean().exec(function (err, doss) {
            if (err) {
                cb(err);
            } else {
                DosssServ.addData(doss, cb);
            }
        });
    });
};

DosssServ.list = function (cb) {
    DossModl.find({}).lean().exec(function (err, Dosss) {
        async.mapSeries(Dosss, DosssServ.addData, cb);
    });
};

DosssServ.children = function (id, cb) {
    DossModl.find({
        parent: id
    }).lean().exec(function (err, Dosss) {
        async.mapSeries(Dosss, DosssServ.addData, cb);
    });
};

DosssServ.add = function (data, cb) {
    DossModl.create({
        titre: data.titre,
        parent: data.parent
    }, function (err, Doss) {
        if (err) {
            cb(err);
        } else {
            DosssServ.get(Doss._id, cb);
        }
    });
};

DosssServ.canWriteIn = function (id, login, cb) {
    DosssServ.exists(id, cb);
};

DosssServ.remove = function (id, cb) {
    // TODO Trash
    DossModl.remove({
        _id: id
    }, cb);
};

module.exports = DosssServ;
