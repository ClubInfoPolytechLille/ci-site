var MembresServ = require('../services/MembresServ');
var SessionsServ = require('../services/SessionsServ');
var DecryptServ = require('../services/DecryptServ');
var ConvsServ = require('../services/ConvsServ');
var express = require('express');

var api = express();

// Sessions
api.get('/session', function (req, res) { // Informations sur la session
    if (req.cookies && req.cookies.session) {
        SessionsServ.use(req.cookies.session, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send(SessionsServ.cur);
            }
        });
        // TODO si pas bon : res.clearCookie('session')
    } else {
        res.send('missing');
    }
});

api.post('/session', function (req, res) { // Se connecter
    DecryptServ.decrypt(req.body[0], function (data) {
        SessionsServ.open(JSON.parse(data), function (err) {
            if (err) {
                res.send(err);
            } else {
                res.cookie('session', SessionsServ.cur._id);
                res.send(SessionsServ.cur);
            }
        });
    });
});

api.delete('/session', function (req, res) { // Se déconnecter
    if (req.cookies.session) {
        SessionsServ.delete(req.cookies.session, function () {
            res.clearCookie('session');
            res.end();
        });
    } else {
        res.send('missing');
    }
});

ifPermission = function (req, res, perm, cb) {
    SessionsServ.use(req.cookies.session, function (err) {
        if (err) {
            res.status(403).end();
        } else {
            if (SessionsServ.cur[perm]) {
                cb();
            } else {
                res.status(403).end();
            }
        }
    });
};


// Membres
api.get('/membres', function (req, res) { // Liste des membres
    MembresServ.list(function (err, membres) {
        if (err)
            res.send(err);
        else
            res.json(membres);
    });
});

api.post('/membres', function (req, res) { // Ajout d'un membre
    ifPermission(req, res, 'canAddMembre', function () {
        MembresServ.add(req.body, function (err, membre) {
            if (err)
                res.send(err);
            else
                res.json(membre);
        });
    });
});

api.delete('/membres/:membre_id', function (req, res) { // Supression d'un membre
    ifPermission(req, res, 'canDelMembre', function () {
        MembresServ.remove(req.params.membre_id, function (err, membre) {
            if (err)
                res.send(err);
            else
                res.json(null);
        });
    });
});


// Conversations
api.get('/convs', function (req, res) { // Liste des convs
    ConvsServ.list(function (err, convs) {
        if (err)
            res.send(err);
        else
            res.json(convs);
    });
});

api.post('/convs', function (req, res) { // Ajout d'un conv
    ifPermission(req, res, 'canAddConv', function () {
        ConvsServ.add(req.body, function (err, conv) {
            if (err)
                res.send(err);
            else
                res.json(conv);
        });
    });
});

api.delete('/convs/:conv_id', function (req, res) { // Supression d'un conv
    ifPermission(req, res, 'canDelConv', function () {
        ConvsServ.remove(req.params.conv_id, function (err, conv) {
            if (err)
                res.send(err);
            else
                res.json(null);
        });
    });
});

module.exports = api;
