var NinfoModl = require('../models/NinfoModl');
var PolyUserServ = require('../services/PolyUserServ');
var async = require('async');

var NinfoServ = module.exports = {

    equipes: ['nope', 'ci', 'imagis', 'ima5'],

    simple: ['equipe', 'comment'],

    simpleData: function (ninfoD, cb) {
        var ninfo = {};
        for (var prop of NinfoServ.simple) {
            ninfo[prop] = ninfoD[prop];
        }
        cb(null, ninfo);
    },


    getLogin: function (login, cb) {
        NinfoModl.findOne({
            login: login
        }, function createIfNotExist(err, ninfo) {
            if (ninfo) {
                cb(err, ninfo);
            } else {
                NinfoModl.create({login: login}, cb);
            }
        });
    },

    assert: function(data, cb) {
        cb(null, data.login && NinfoServ.equipes.indexOf(data.equipe) != -1);
    },

    add: function (data, cb) { // Ajouter les préférences, ou les mettre
                               // à jour (vu qu'il n'y a pas de sujet add fait les deux)
        // Pas de vérification car tout est fait dans assert (et login n'est pas modifié
        // par l'utilisateur)
        NinfoServ.getLogin(data.login, function(err, ninfo) {
            ninfo.equipe = data.equipe;
            ninfo.comment = data.comment;
            ninfo.save(cb);
        });
    }

};
