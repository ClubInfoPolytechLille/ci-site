var MembresServ = require('../services/MembresServ');
var PolyUserServ = require('../services/PolyUserServ');
var DecryptServ = require('../services/DecryptServ');
var DosssServ = require('../services/DosssServ');
var ConvsServ = require('../services/ConvsServ');
var MessServ = require('../services/MessServ');
var fs = require('fs');
var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var api = express();

// Connection à la BDD
mongoose.connect(require('../../config/db').url);

// Authentication
reqAuth = function () {
    return function (req, res, next) {
        if (req.session.data && req.session.data.login) {
            next();
        } else {
            res.status(401).end();
        }
    };
};

reqVerified = function (verify) { // Assert mais pour les droits (d'où le 403)
    return function (req, res, next) {
        reqAuth()(req, res, function () {
            verify(req, res, function (err, verified) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (verified) {
                        next();
                    } else {
                        res.status(403).end();
                    }
                }
            });
        });
    };
};

reqPerm = function (perm) {
    return reqVerified(function (req, res, cb) {
        cb(null, req.session.data[perm]);
    });
};

assert = function (test) {
    return function (req, res, next) {
        test(req, res, function (err, verified) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (verified) {
                    next();
                } else {
                    res.status(400).end();
                }
            }
        });
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
        MembresServ.estBureau(session.login, function (bureau) {
            session.bureau = bureau;
            // Permissions
            session.canAddMembre = session.bureau;
            session.canDelMembre = session.bureau;
            session.canAddDoss = session.bureau;
            session.canDelDoss = session.bureau;
            session.canAddConv = true;
            session.canDelConv = session.bureau;
            session.canAddMess = true;
            session.canEditMess = session.bureau;
            session.canDelMess = session.bureau;
            cb(session);
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
    PolyUserServ.verify(req.body.login, req.body.pass, function (err, verified) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (verified) {
                sessionData({
                    login: req.body.login
                }, function (session) {
                    req.session.data = session;
                    req.session.save(function (err) {
                        if (err) {
                            res.status(500).end("Sauvegarde session");
                        } else {
                            res.status(201).send(session);
                        }
                    });
                });
            } else {
                req.session.destroy(function (err) {
                    if (err) {
                        res.status(500).end("Suppression de la session");
                    } else {
                        res.status(401).end();
                    }
                });
            }
        }
    });
});

api.delete('/session', function (req, res) { // Se déconnecter
    req.session.destroy();
    res.status(200).end();
});


// Membres
api.get('/membres', function (req, res) { // Liste des membres
    MembresServ.list(function (err, membres) {
        if (err)
            res.status(500).send(err);
        else
            res.json(membres);
    });
});

api.post('/membres', assert(function (req, res, cb) {
    cb(null, typeof req.body.login == 'string' && req.body.login !== '');
}), reqPerm('canAddMembre'), function (req, res) { // Ajout d'un membre
    MembresServ.add(req.body, function (err, membre) {
        if (err)
            res.status(500).send(err);
        else
            res.json(membre);
    });
});

api.delete('/membres/:membre_id', reqPerm('canDelMembre'), function (req, res) { // Supression d'un membre
    MembresServ.remove(req.params.membre_id, function (err, membre) {
        if (err)
            res.status(500).send(err);
        else
            res.json(null);
    });
});

// Dossiers
api.get('/dosss/:doss_id', function (req, res) { // Un doss
    // TODO Assertion 404 existe, transformer req.body.id avec la vraie id (ou redirect)
    // TODO Requêtes séparées ?
    DosssServ.get(req.params.doss_id, function (err, doss) { // TODO Async
        if (err) {
            res.status(500).send(err);
        } else if (!doss) {
            res.status(404);
        } else {
            DosssServ.children(doss._id, function (err, dosss) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    doss.dosss = dosss;
                    ConvsServ.children(doss._id, function (err, convs) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            doss.convs = convs;
                            res.json(doss);
                        }
                    });
                }
            });
        }
    });
});

api.post('/dosss', reqPerm('canAddDoss'), function (req, res) { // Ajout d'un doss
    // TODO Assertion 404 existe, transformer req.body.id avec la vraie id (ou redirect)
    DosssServ.getId(req.body.parent, function (parent) { // TODO Async
        req.body.parent = parent;
        DosssServ.add(req.body, function (err, doss) {
            if (err)
                res.status(500).send(err);
            else
                res.json(doss);
        });
    });
});

api.delete('/dosss/:doss_id', reqPerm('canDelDoss'), function (req, res) { // Supression d'un doss
    DosssServ.remove(req.params.doss_id, function (err, doss) {
        if (err)
            res.status(500).send(err);
        else
            res.json(null);
    });
});

// Conversations
api.get('/convs/:conv_id', function (req, res) { // Une conv
    ConvsServ.get(req.params.conv_id, function (err, conv) {
        if (err)
            res.status(500).send(err);
        else
            res.json(conv);
    });
});

api.post('/convs', reqPerm('canAddConv'), function (req, res) { // Ajout d'un conv
    // TODO Assertion 404 existe, transformer req.body.id avec la vraie id (ou redirect)
    DosssServ.getId(req.body.parent, function (parent) { // TODO Async
        req.body.parent = parent;
        ConvsServ.add(req.body, function (err, conv) {
            if (err)
                res.status(500).send(err);
            else
                res.json(conv);
        });
    });
});

api.delete('/convs/:conv_id', reqPerm('canDelConv'), function (req, res) { // Supression d'un conv
    ConvsServ.remove(req.params.conv_id, function (err, conv) {
        if (err)
            res.status(500).send(err);
        else
            res.json(null);
    });
});

// Messages
api.get('/messs/:conv_id', reqAuth(), function (req, res) { // Liste des messs
    MessServ.list(req.params.conv_id, function (err, messs) {
        if (err)
            res.status(500).send(err);
        else
            res.json(messs);
    });
});

api.get('/messs/:mess_id', reqAuth(), function (req, res) { // Une mess
    MessServ.get(req.params.mess_id, function (err, mess) {
        if (err)
            res.status(500).send(err);
        else
            res.json(mess);
    });
});

api.post('/messs', reqPerm('canAddMess'), function (req, res) { // Ajout d'un mess
    data = req.body;
    data.login = req.session.data.login;
    MessServ.add(data, function (err, mess) {
        if (err)
            res.status(500).send(err);
        else
            res.json(mess);
    });
});

api.put('/messs', reqPerm('canEditMess'), function (req, res) { // Édition d'un message
    MessServ.edit(req.body, function (err, mess) {
        console.log('CALLED', err, mess);
        if (err) {
            if (err == 'notfound') {
                res.status(404).end();
            } else {
                res.status(500).json(err);
            }
        } else {
            res.status(201).json(mess);
        }
    });
});

api.delete('/messs/:mess_id', reqPerm('canDelMess'), function (req, res) { // Supression d'un mess
    MessServ.remove(req.params.mess_id, function (err, mess) {
        if (err)
            res.status(500).send(err);
        else
            res.json(null);
    });
});

api.all('/coffee', function (req, res) {
    res.status(418).end();
});

api.all('*', function (req, res) {
    res.status(405).end();
});

module.exports = api;
