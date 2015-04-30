var MessModl = require('../models/MessModl');
var MembresServ = require('../services/MembresServ');
var async = require('async');

var MesssServ = module.exports = {

    simple: ['_id', 'login', 'content', 'conv', 'date', 'hidden'],

    simpleData: function (messD, cb) {

        async.parallel([
            function (cba) {
                var mess = {};
                for (var prop of MesssServ.simple) {
                    mess[prop] = messD[prop];
                }
                cba(null, mess);
            },
            function (cba) {
                async.waterfall([
                    function (cbaa) {

                        MembresServ.getLogin(messD.login, cbaa);
                    },
                    function (membre, cbaa) {
                        MembresServ.simpleData(membre, cbaa);
                    }
                ], cba);
            }
        ], function (err, res) {
            if (err) {
                cb(err);
            } else {
                mess = res[0];
                mess.auteur = res[1];
                cb(null, mess);
            }
        });
    },

    get: function (id, cb) {
        MessModl.findById(id, cb);
    },

    children: function (conv, cb) {
        MessModl.find({
            conv: conv,
            $or: [{
                hidden: false
            }, {
                hidden: undefined
            }]
        }, cb);
    },

    assert: function (mess, cb) {
        cb(null, mess.login && mess.content && mess.conv);
    },

    add: function (data, cb) {
        MessModl.create({
            content: data.content,
            login: data.login,
            conv: data.conv
        }, cb);
    },

    edit: function (mess, data, cb) {
        mess.content = data.content;
        // TODO Edit date
        mess.save(cb);
    },

    remove: function (id, cb) {
        async.waterfall([function (cba) {
            MesssServ.get(id, cba);
        }, function (mess, cba) {
            cba(mess ? null : 'notfound', mess);
        }, function (mess, cba) {
            mess.hidden = true;
            mess.save(cba);
        }], cb);
    }
};
