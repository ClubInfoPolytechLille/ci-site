var ConvModl = require('../models/ConvModl');
var DosssServ = require('../services/DosssServ');
var async = require('async');

var ConvsServ = module.exports = {

    simple: ['_id', 'titre', 'parent', 'hidden'],

    simpleData: function (convD, cb) {
        // TODO Démarré par
        // TODO Dernier message
        var conv = {};
        for (var prop of ConvsServ.simple) {
            conv[prop] = convD[prop];
        }
        cb(null, conv);
    },

    detailedData: function (convD, cb) {
        async.parallel([
            function (cba) {
                var conv = {};
                for (var prop of ConvsServ.simple) {
                    conv[prop] = convD[prop];
                }
                cba(null, conv);
            },
            function (cba) {
                MessServ = require('../services/MessServ')
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
    },

    get: function (id, cb) {
        ConvModl.findById(id, cb);
    },

    children: function (id, cb) { // Conversations filles du dossier en paramètre
        ConvModl.find({
            parent: id,
            $or: [{
                hidden: false
            }, {
                hidden: undefined
            }]
        }, cb);
    },

    assert: function (conv, cb) {
        cb(null, conv.titre, conv.parent);
    },

    add: function (data, cb) {
        ConvModl.create({
            titre: data.titre,
            parent: data.parent
        }, cb);
    },

    remove: function (id, cb) {
        async.waterfall([function (cba) {
            ConvsServ.get(id, cba);
        }, function (conv, cba) {
            cba(conv ? null : 'notfound', conv);
        }, function (conv, cba) {
            DosssServ.get('trash', function (err, trash) {
                console.log(21, trash);
                cba(err, conv, trash);
            });
        }, function (conv, trash, cba) {
            conv.parent = trash._id;
            conv.save(cba);
        }], cb);
    }
};
