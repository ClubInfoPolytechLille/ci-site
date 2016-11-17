var NinfoModl = require('../models/NinfoModl');
var PolyUserServ = require('../services/PolyUserServ');
var async = require('async');

var NinfoServ = module.exports = {

    equipes: [
        {id: 'nope', desc : "Je ne souhaite pas participer", ouvert: true, show: false},
        {id: 'ci', desc : "Équipe « Kilobits », pour se donner à fond", referent: ["Benoit Verhaeghe", "Benoit.Verhaeghe@polytech-lille.net"], ouvert: true, show: true},
        {id: 'nobrain', desc : "Équipe « 404 Brain Not Found », surtout pour passer un bon moment", referent: ["Cédric Roussel", "Cedric.Roussel@polytech-lille.net"], ouvert: true, show: true},
        {id: 'gis5', desc : "Équipe GIS5", referent: ["Thibault Giordan", "Thibault.Giordan@polytech-lille.net"], ouvert: false, show: false},
        {id: 'peip', desc : "Équipe « PREPAration de l'IMAGISnation », des PeiP sérieux", referent: ["Romain Bailleul", "Romain.Bailleul@polytech-lille.net"], ouvert: true, show: true},
        {id: 'other', desc : "Une autre équipe ?", referent: ["Geoffrey Preud'homme", "Geoffrey.Bontoux-Preud-Homme@polytech-lille.net"], ouvert: false, show: false},
    ],

    simple: ['login', 'equipe', 'comment'],

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
        async.detect(NinfoServ.equipes, function (equipe, cba) {
            cba(equipe.id == data.equipe && equipe.ouvert);
        }, function(correct) {
            cb(null, correct);
        });
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
    },

    list: function (cb) {
        NinfoModl.find({}, cb);
    },

    listEquipes: function (cb) {
        NinfoServ.list(function (err, participants) {
            async.map(NinfoServ.equipes, function(equipe, cb) {
                async.filter(participants, function concerne(participant, cbf) {
                    cbf(participant.equipe == equipe.id);
                }, function addInfos(membres) {
                    async.map(membres, function (membre, cba) {
                        async.parallel([function(cbp) {
                            PolyUserServ.get(membre.login, cbp);
                        }, function(cbp) {
                            NinfoServ.simpleData(membre, cbp);
                        }], function(err, results) {
                            var membreFinal = results[0];
                            membreFinal.equipe = results[1].equipe;
                            membreFinal.comment = results[1].comment;
                            cba(null, membreFinal);
                        });
                    }, function (err, membres) {
                        equipe.membres = membres;
                        cb(null, equipe);
                    });
                });
            }, cb);
        });
    },

};
