var ConvModl = require('../models/ConvModl');
var MessServ = require('../services/MessServ');
var async = require('async');

var ConvsServ = {};

ConvsServ.simple = ['_id', 'titre', 'parent', 'hidden'];

ConvsServ.simpleData = function (convD, cb) {
    // TODO Démarré par
    // TODO Dernier message
    var conv = {};
    for (var prop of ConvsServ.simple) {
        conv[prop] = convD[prop];
    }
    cb(null, conv);
};

ConvsServ.detailedData = function (convD, cb) {
    async.parallel([
        function (cba) {
            var conv = {};
            for (var prop of ConvsServ.simple) {
                conv[prop] = convD[prop];
            }
            cba(null, conv);
        },
        function (cba) {
            MessServ.children(convD._id, function (err, children) {

                if (err) {
                    cba(err);
                } else {
                    async.map(children, MessServ.simpleData, cba);
                }
            });
        }
    ], function (err, res) {
        if (err) {
            cb(err);
        } else {
            conv = res[0];
            conv.messs = res[1];

            cb(null, conv);
        }
    });
};

ConvsServ.get = function (id, cb) {
    ConvModl.findById(id, cb);
};

ConvsServ.children = function (id, cb) { // Conversations filles du dossier en paramètre
    ConvModl.find({
        parent: id,
        $or: [{
            hidden: false
        }, {
            hidden: undefined
        }]
    }, cb);
};

ConvsServ.assert = function (conv, cb) {
    cb(null, conv.titre, conv.parent);
};

ConvsServ.add = function (data, cb) {
    ConvModl.create({
        titre: data.titre,
        parent: data.parent
    }, cb);
};

ConvsServ.remove = function (id, cb) {
    async.waterfall([function (cba) {
        ConvsServ.get(id, cba);
    }, function (conv, cba) {
        cba(conv ? null : 'notfound', conv);
    }, function (conv, cba) {
        conv.parent = 'trash';
        conv.save(cba);
    }], cb);
};

module.exports = ConvsServ;
