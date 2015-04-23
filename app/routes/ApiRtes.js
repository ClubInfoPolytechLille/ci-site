var MembresServ = require('../services/MembresServ');
var PolyUserServ = require('../services/PolyUserServ');
var DecryptServ = require('../services/DecryptServ');
var DosssServ = require('../services/DosssServ');
var DossModl = require('../models/DossModl');
var ConvsServ = require('../services/ConvsServ');
var ConvModl = require('../models/ConvModl');
var MessServ = require('../services/MessServ');
var MessModl = require('../models/MessModl'); // TODO Unfier ce bazar / supprimer Serv
var fs = require('fs');
var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var api = express();

// Connection à la BDD
mongoose.connect(require('../../config/db').url);

// Fonctions diverses
ensureOkay = function (res, status, cb) {
    // TODO Statut par défaut / optionnel
    // status = 500;
    return function (err, data) {
        // TODO Différencier data non-présent / faux
        if (err) {
            res.status(status).json(err);
        } else {
            cb(data);
        }
    };
};

giveBackNull = function (res, status) {
    // TODO Statut par défaut / optionnel
    // status = 200;
    return ensureOkay(res, 404, function (data) {
        res.status(status);
        if (status != 204 && status != 205) {
            res.json(data);
        } else {
            res.end();
        }
    });
};

ensureExists = function (res, status, cb) {
    // TODO Statut par défaut / optionnel
    // status = 404;
    return ensureOkay(res, 500, function (data) {
        if (data) {
            cb(data);
        } else {
            res.status(status).end();
        }
    });
};

giveBack = function (res, status) {
    // TODO Statut par défaut / optionnel
    // status = 200;
    return ensureExists(res, 404, function (data) {
        res.status(status);
        if (status != 204 && status != 205) {
            res.json(data);
        } else {
            res.end();
        }
    });
};

// Authentication
reqAuth = function (req, res, next) {
    if (req.session.data && req.session.data.login) {
        next();
    } else {
        res.status(401).end();
    }
};

reqVerified = function (verify) { // Assert mais pour les droits (d'où le 403)
    return function (req, res, next) {
        reqAuth(req, res, function () {
            verify(req, res, function (err, data) {
                cb = ensureExists(res, 403, function () {
                    next(); // Si on passe quoi que ce soit à next(), erreur 500
                });
                cb(err, data);
            });
        });
    };
};

reqOwn = function (objName) {
    return reqVerified(function (req, res, cb) {
        cb(null, req.session.data.bureau || req[objName].login == req.session.data.login);
    });
};

reqMembre = reqVerified(function (req, res, cb) {
    cb(null, req.session.data.membre);
});

reqBureau = reqVerified(function (req, res, cb) {
    cb(null, req.session.data.bureau);
});

assert = function (test) {
    return function (req, res, next) {
        test(req, res, ensureExists(res, 400, function () {
            next();
        }));
    };
};

decrypt = function () {
    return function (req, res, next) {
        assert(function (req, res, cb) {
            cb(null, req.body && typeof req.body[0] == 'string' && req.body[0] !== '');
        })(req, res, function () {
            DecryptServ.decrypt(req.body[0], function (data) {
                req.body = JSON.parse(data);
                next();
            });
        });
    };
};


// Sessions

sessionData = function (session, cb) {
    PolyUserServ.get(session.login, function (err, nom) {
        // Nom
        session.nom = nom.nom;
        session.section = nom.section;
        MembresServ.estMembre(session.login, function (membre) { // TODO Asyc
            session.membre = membre;
            MembresServ.estBureau(session.login, function (bureau) {
                session.bureau = bureau;
                cb(session);
            });
        });
    });
};

api.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    name: 'membreCool',
    resave: false,
    saveUninitialized: false,
    secret: fs.readFileSync('config/session_secret', {
        encoding: 'UTF8'
    })
}));

api.get('/session', function (req, res) { // Informations sur la session
    res.send(req.session.data);
});

api.post('/session', decrypt(), assert(function (req, res, cb) {
    cb(null, req.body && typeof req.body.login == 'string' && req.body.login !== '' && typeof req.body.pass == 'string' && req.body.pass !== '');
}), function (req, res) { // Se connecter
    PolyUserServ.verify(req.body.login, req.body.pass, ensureOkay(res, 500, function (verified) {
        if (verified) {
            sessionData({
                login: req.body.login
            }, function (session) {
                req.session.data = session;
                req.session.save(function (err) {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(201).json(session);
                    }
                });
            });
        } else {
            req.session.destroy(ensureOkay(res, 500, function () {
                res.status(401).end();
            }));
        }
    }));
});

api.delete('/session', function (req, res) { // Se déconnecter
    req.session.destroy();
    res.status(205).end();
});


// Membres
api.get('/membres', function (req, res) { // Liste des membres
    MembresServ.list(giveBack(res, 200));
});

api.post('/membres', assert(function (req, res, cb) {
    cb(null, typeof req.body.login == 'string' && req.body.login !== '');
}), reqBureau, function (req, res) { // Ajout d'un membre
    MembresServ.add(req.body, giveBack(res, 201));
});

api.delete('/membres/:membre_id', reqBureau, function (req, res) { // Supression d'un membre
    MembresServ.remove(req.params.membre_id, giveBack(res, 205));
});

// Dossiers
api.get('/dosss/:doss_id', reqAuth, function (req, res) { // Un doss
    // TODO Assertion 404 existe, transformer req.body.id avec la vraie id (ou redirect)
    // TODO Requêtes séparées ?
    // TODO Async
    DosssServ.get(req.params.doss_id, ensureExists(res, 404, function (doss) {
        DosssServ.children(doss._id, ensureOkay(res, 500, function (dosss) {
            ConvsServ.children(doss._id, ensureOkay(res, 500, function (convs) {
                doss.dosss = dosss;
                doss.convs = convs;
                res.json(doss);
            }));
        }));
    }));
});

api.post('/dosss', reqMembre, function (req, res) { // Ajout d'un doss
    // TODO Assertion 404 existe, transformer req.body.id avec la vraie id (ou redirect)
    DosssServ.getId(req.body.parent, function (parent) { // TODO Async
        req.body.parent = parent;
        DosssServ.add(req.body, giveBackNull(res, 201));
    });
});

api.delete('/dosss/:doss_id', reqBureau, function (req, res) { // Supression d'un doss
    DosssServ.remove(req.params.doss_id, giveBackNull(res, 205));
});

// Conversations

getSubject = function (modl) {
    // TODO Gérer les dossiers
    return function (req, res, next) {
        modl.findById(req.params._id, ensureExists(res, 404, function (data) {
            req.subject = data;
            next();
        }));
    };
};

getConv = function (req, res, next) {
    ConvModl.findById(req.params.conv_id, ensureExists(res, 404, function (data) {
        req.conv = conv;
        next();
    }));
};

api.get('/convs/:_id', reqAuth, getSubject(ConvModl), function (req, res) { // Une conv
    res.json(req.subject);
});

// Ajout d'un conv
api.post('/convs', reqMembre, function (req, res) {
    // TODO Assertion 404 existe, transformer req.body.id avec la vraie id (ou redirect)
    DosssServ.getId(req.body.parent, function (parent) { // TODO Async
        req.body.parent = parent;
        ConvsServ.add(req.body, giveBack(res, 201));
    });
});

// Supression d'un conv
api.delete('/convs/:_id', reqBureau, getSubject(ConvModl), function (req, res) {
    req.subject.remove(giveBack(res, 205));
});

// Messages

api.get('/messs/:conv_id', reqAuth, function (req, res) { // Liste des messs
    MessServ.list(req.params.conv_id, giveBackNull(res, 200));
});

api.post('/messs', reqMembre, function (req, res) { // Ajout d'un mess
    data = req.body;
    data.login = req.session.data.login;
    MessServ.add(data, giveBack(res, 201));
});

// Édition d'un mess
api.put('/messs/:_id', reqMembre, getSubject(MessModl), reqOwn('mess'), function (req, res) {
    req.subject.content = req.body.content;
    // TODO Edit date
    req.subject.save(giveBack(res, 201));
});

// Supression d'un mess
api.delete('/messs/:_id', reqMembre, getSubject(MessModl), reqOwn('mess'), function (req, res) {
    req.subject.remove(giveBack(res, 205));
});

api.all('/coffee', function (req, res) {
    res.status(418).end();
});

api.all('*', function (req, res) {
    res.status(405).end();
});

module.exports = api;
