var Membre = require('../models/membre');
var express = require('express');

var api = express()

// Membres
api.get('/membres', function (req, res) {
    Membre.find(function (err, membres) {
        if (err)
            res.send(err);
        res.json(membres);
    });
});

api.post('/membres', function (req, res) {
    Membre.create({
        login: req.body.login,
        role: req.body.role,
        section: req.body.section,
    }, function (err, membre) {
        if (err)
            res.send(err);
        Membre.find(function (err, membres) {
            if (err)
                res.send(err);
            res.json(membres);
        });
    });
});

api.delete('/membres/:membre_id', function (req, res) {
    Membre.remove({
        _id: req.params.membre_id
    }, function (err, membre) {
        if (err)
            res.send(err);
        Membre.find(function (err, membres) {
            if (err)
                res.send(err);
            res.json(membres);
        });
    })
})

module.exports = api;