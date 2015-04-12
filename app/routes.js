var path = require('path');
var api = require('./routes/ApiRtes');
var favicon = require('serve-favicon');
var express = require('express');

module.exports = function (app) {

    // Statique
    app.use(favicon(path.normalize(__dirname + '/../public/favicon.ico')));
    app.use(express.static(path.normalize(__dirname + '/../public')));

    // API
    app.use('/api/', api);

    // Défaut
    app.get('*', function (req, res) {
        if (req.accepts('text/html')) {
            res.sendFile('public/views/index.html', {
                root: path.normalize(__dirname + '/..')
            });
        } else {
            res.send(404).end();
        }
    });

    // Mauvaise requête
    app.all('*', function (req, res) {
        res.send(405).end();
    });

};
