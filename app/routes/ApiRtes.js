var MembresServ = require('../services/MembresServ');
var SessionsServ = require('../services/SessionsServ');
var DecryptServ = require('../services/DecryptServ');
var ConvsServ = require('../services/ConvsServ');
var express = require('express');

var api = express();

// Authentication
requireAuth = function () {
    return function (req, res, next) {
        SessionsServ.use(req.cookies.session, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (SessionsServ.cur) {
                    req.session = SessionsServ.cur;
                    next();
                } else {
                    res.status(401).end();
                }
            }
        });
    };
};

requirePerm = function (perm) {
    return function (req, res, next) {
        requireAuth()(req, res, function () {
            if (req.session[perm]) {
                next();
            } else {
                res.status(403).end();
            }
        });
    };
};

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


// Membres
api.get('/membres', function (req, res) { // Liste des membres
    MembresServ.list(function (err, membres) {
        if (err)
            res.send(err);
        else
            res.json(membres);
    });
});

api.post('/membres', requirePerm('canAddMembre'), function (req, res) { // Ajout d'un membre
    MembresServ.add(req.body, function (err, membre) {
        if (err)
            res.send(err);
        else
            res.json(membre);
    });
});

api.delete('/membres/:membre_id', requirePerm('canDelMembre'), function (req, res) { // Supression d'un membre
    MembresServ.remove(req.params.membre_id, function (err, membre) {
        if (err)
            res.send(err);
        else
            res.json(null);
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

api.get('/convs/:conv_id', function (req, res) { // Une conv
    ConvsServ.get(req.params.conv_id, function (err, conv) {
        if (err)
            res.send(err);
        else
            res.json(conv);
    });
});

api.post('/convs', requirePerm('canAddConv'), function (req, res) { // Ajout d'un conv
    ConvsServ.add(req.body, function (err, conv) {
        if (err)
            res.send(err);
        else
            res.json(conv);
    });
});

api.delete('/convs/:conv_id', requirePerm('canDelConv'), function (req, res) { // Supression d'un conv
    ConvsServ.remove(req.params.conv_id, function (err, conv) {
        if (err)
            res.send(err);
        else
            res.json(null);
    });
});

// Messages
api.get('/messs', function (req, res) { // Liste des messs
    MessServ.list(function (err, messs) {
        if (err)
            res.send(err);
        else
            res.json(messs);
    });
});

api.get('/messs/:mess_id', function (req, res) { // Une mess
    MessServ.get(req.params.mess_id, function (err, mess) {
        if (err)
            res.send(err);
        else
            res.json(mess);
    });
});

api.post('/messs', requireAuth(), function (req, res) { // Ajout d'un mess
    MessServ.add(req.body, function (err, mess) {
        if (err)
            res.send(err);
        else
            res.json(mess);
    });
});

api.delete('/messs/:mess_id', requireAuth(), function (req, res) { // Supression d'un mess
    MessServ.remove(req.params.mess_id, function (err, mess) {
        if (err)
            res.send(err);
        else
            res.json(null);
    });
});

module.exports = api;
