// Modules ====================================================================
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Application ================================================================

var app = express();
var config = require('./config/config.js');
var port = process.env.PORT || config.port;

// Connection à la BDD
var db = require('./config/db');
mongoose.connect(db.url);

// Tricks
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Routes
require('./app/routes')(app);

app.listen(port);

console.log('La magie du CI se passe au port ' + port);

exports = module.exports = app;
