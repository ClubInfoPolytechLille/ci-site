var membres = require('../controllers/membres');
var sessions = require('../controllers/sessions');
var express = require('express');

var api = express()

// Sessions
api.get('/session', function (req, res) { // Informations sur la session
    if (req.cookies && req.cookies.session) {
        sessions.verify(req.cookies.session, function (err, session) {
            if (err) {
                res.send(err)
            } else {
                res.send(session)
            }
        })
        // TODO si pas bon : res.clearCookie('session')
    } else {
        res.send('missing');
    }
});

api.post('/session', function (req, res) { // Se connecter
    sessions.open(req.body, function (err, session) {
        if (err) {
            res.send(err)
        } else {
            res.cookie('session', session._id);
            res.send(session)
        }
    })
})

api.delete('/session', function (req, res) { // Se déconnecter
    if (req.cookies.session) {
        sessions.delete(req.cookies.session, function () {
            res.clearCookie('session');
            res.end()
        })
    } else {
        res.send('missing')
    }
})


// Membres
api.get('/membres', function (req, res) { // Liste des membres
    membres.list(function (err, membres) {
        if (err)
            res.send(err);
        res.json(membres);
    });
});

api.post('/membres', function (req, res) { // Ajout d'un membre
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

api.delete('/membres/:membre_id', function (req, res) { // Supression d'un membre
    membres.remove(req.params.membre_id, function (err, membre) {
        if (err)
            res.send(err);
        membres.list(function (err, membres) {
            if (err)
                res.send(err);
            res.json(membres);
        });
    });
})

module.exports = api;