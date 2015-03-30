var membres = require('../controllers/membres');
var sessions = require('../controllers/sessions');
var decrypt = require('../controllers/decrypt');
var express = require('express');

var api = express();

// Sessions
api.get('/session', function (req, res) { // Informations sur la session
    if (req.cookies && req.cookies.session) {
        sessions.use(req.cookies.session, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send(sessions.cur);
            }
        });
        // TODO si pas bon : res.clearCookie('session')
    } else {
        res.send('missing');
    }
});

api.post('/session', function (req, res) { // Se connecter
    decrypt.decrypt(req.body[0], function (data) {
        sessions.open(JSON.parse(data), function (err) {
            if (err) {
                res.send(err);
            } else {
                res.cookie('session', sessions.cur._id);
                res.send(sessions.cur);
            }
        });
    });
});

api.delete('/session', function (req, res) { // Se déconnecter
    if (req.cookies.session) {
        sessions.delete(req.cookies.session, function () {
            res.clearCookie('session');
            res.end();
        });
    } else {
        res.send('missing');
    }
});

ifPermission = function (req, res, perm, cb) {
    sessions.use(req.cookies.session, function (err) {
        if (err) {
            res.status(403).end();
        } else {
            if (sessions.cur[perm]) {
                cb();
            } else {
                res.status(403).end();
            }
        }
    });
};


// Membres
api.get('/membres', function (req, res) { // Liste des membres
    membres.list(function (err, membres) {
        if (err)
            res.send(err);
        res.json(membres);
    });
});

api.post('/membres', function (req, res) { // Ajout d'un membre
    ifPermission(req, res, 'canAddMembre', function () {
        membres.add(req.body, function (err, membre) {
            if (err)
                res.send(err);
            membres.list(function (err, membres) {
                if (err)
                    res.send(err);
                res.json(membres);
            });
        });
    });
});

api.delete('/membres/:membre_id', function (req, res) { // Supression d'un membre
    ifPermission(req, res, 'canDelMembre', function () {
        membres.remove(req.params.membre_id, function (err, membre) {
            if (err)
                res.send(err);
            membres.list(function (err, membres) {
                if (err)
                    res.send(err);
                res.json(membres);
            });
        });
    });
});

module.exports = api;
