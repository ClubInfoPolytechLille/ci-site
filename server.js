// Modules ====================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Application ================================================================

var port = process.env.PORT || 8080;

// Connection à la BDD
var db = require('./config/db');
mongoose.connect(db.url);

// Tricks
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('X-HTTP-Method-Override'));

// Dossier public
app.use(express.static(__dirname + '/public'));

// Routes
require('./app/routes')(app);

app.listen(port);

console.log('La magie du CI se passe au port ' + port);

exports = module.exports = app;