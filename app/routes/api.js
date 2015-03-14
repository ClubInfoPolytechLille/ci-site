var membres = require('../controllers/membres');
var express = require('express');

var api = express()

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