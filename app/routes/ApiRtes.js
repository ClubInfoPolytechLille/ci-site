var MembresServ = require('../services/MembresServ');
var NinfoServ = require('../services/NinfoServ');
var PolyUserServ = require('../services/PolyUserServ');
var DecryptServ = require('../services/DecryptServ');
var DosssServ = require('../services/DosssServ');
var ConvsServ = require('../services/ConvsServ');
var MessServ = require('../services/MessServ');
var fs = require('fs');
var async = require('async');
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

giveNull = function (res, status) {
    // TODO Statut par défaut / optionnel
    // status = 200;
    return ensureOkay(res, 404, function (data) {
        res.status(status).end();
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

        res.status(status).json(data);
    });
};

// Authentication
addLogin = function (req, res, next) {
    req.body.login = req.session.data.login;
    next();
};

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
            verify(req, res, ensureExists(res, 403, function () {
                next(); // Si on passe quoi que ce soit à next(), erreur 500
            }));
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
    async.parallel([
        function (cba) {
            PolyUserServ.get(session.login, cba);
        },
        function (cba) {
            MembresServ.estMembre(session.login, cba);
        },
        function (cba) {
            MembresServ.estBureau(session.login, cba);
        }
    ], function (err, res) {
        if (err) {
            cb(err);
        } else {
            for (var attrname in res[0]) { session[attrname] = res[0][attrname]; }
            session.membre = res[1];
            session.bureau = res[2];
            cb(null, session);
        }
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
            }, ensureOkay(res, 500, function (session) {
                req.session.data = session;
                req.session.save(ensureOkay(res, 500, function () {
                    res.status(201).json(session);
                }));
            }));
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

getSubject = function (serv) { // Fonction générique pour récupérer un objet spécifié dans l'URL
    return function (req, res, next) {
        serv.get(req.params._id, ensureExists(res, 404, function (data) {
            req.subject = data;
            next();
        }));
    };
};

assertSubject = function (serv) {
    return assert(function (req, res, cb) {
        serv.assert(req.body, cb);
    });
};

addSubject = function (serv) {
    return function (req, res) {
        serv.add(req.body, ensureExists(res, 404, function (membre) {
            serv.simpleData(membre, giveBack(res, 201));
        }));
    };
};

delSubject = function (serv) {
    return function (req, res) {
        serv.remove(req.subject, giveNull(res, 205));
    };
};

// Membres

// Liste des membres
api.get('/membres', function (req, res) {
    MembresServ.list(ensureExists(res, 404, function (membres) {
        async.map(membres, MembresServ.simpleData, function (err, data) {
            giveBack(res, 200)(err, data);
        });
    }));
});

// Ajout d'un membre
api.post('/membres', reqBureau, assertSubject(MembresServ), function (req, res) {

    MembresServ.add(req.body, ensureExists(res, 404, function (membre) {

        MembresServ.simpleData(membre, giveBack(res, 201));
    }));
});

// Supression d'un membre
api.delete('/membres/:_id', reqBureau, getSubject(MembresServ), delSubject(MembresServ));


// Nuit de l'Info

// Obtenir les préférences
api.get('/profile/ninfo', reqAuth, addLogin, function(req, res) {
    NinfoServ.getLogin(req.body.login, function(err, ninfo) {
        NinfoServ.simpleData(ninfo, giveBack(res, 200));
    });
});

// Mettre à jour les préférences
api.put('/profile/ninfo', reqAuth, addLogin, assertSubject(NinfoServ), addSubject(NinfoServ));

// Lister les participants
api.get('/ninfo', reqAuth, function(req, res) {
    NinfoServ.list(function (err, participants) {
        async.reduce(NinfoServ.equipes, {}, function(memo, nomEquipe, cb) {
            async.filter(participants, function concerne(participant, cbf) {
                cbf(participant.equipe == nomEquipe);
            }, function addInfos(membres) {
                async.map(membres, function (membre, cba) {
                    async.parallel([function(cbp) {
                        PolyUserServ.get(membre.login, cbp);
                    }, function(cbp) {
                        NinfoServ.simpleData(membre, cbp);
                    }], function(err, results) {
                        var membreFinal = results[0];
                        membreFinal.equipe = results[1].equipe;
                        membreFinal.comment = results[1].comment;
                        cba(null, membreFinal);
                    });
                }, function (err, membres) {
                    memo[nomEquipe] = membres;
                    cb(null, memo);
                });
            });
        }, function gb(err, data) {
            res.status(200).json(data);
        });
    });
});

// Dossiers

parentId = function (req, res, next) {
    DosssServ.get(req.body.parent, ensureExists(res, 404, function (parent) {
        req.body.parent = parent._id;
        next();
    }));
};

// Un doss
api.get('/dosss/:_id', reqAuth, getSubject(DosssServ), function (req, res) {
    DosssServ.detailedData(req.subject, giveBack(res, 200));
});

// Ajout d'un doss
api.post('/dosss', reqMembre, parentId, assertSubject(DosssServ), addSubject(DosssServ));

// Supression d'un doss
api.delete('/dosss/:_id', reqBureau, getSubject(DosssServ), delSubject(DosssServ));

// Conversations

// Infos sur une conversation
api.get('/convs/:_id', reqAuth, getSubject(ConvsServ), function (req, res) {
    ConvsServ.detailedData(req.subject, giveBack(res, 200));
});

// Ajout d'une conversation
api.post('/convs', reqMembre, parentId, assertSubject(ConvsServ), addSubject(ConvsServ));

// Supression d'une conversation
api.delete('/convs/:_id', reqBureau, getSubject(ConvsServ), delSubject(ConvsServ));

// Messages

// Liste des messs
// api.get('/messs/:conv_id', reqAuth, function (req, res) {
//     MessServ.list(req.params.conv_id, ensureExists(res, 404, function (messs) {
//         async.map(messs, MessServ.simpleData, giveBack(res, 200));
//     }));
// });

// Ajout d'un mess
api.post('/messs', reqMembre, addLogin, assertSubject(MessServ), addSubject(MessServ));

// Édition d'un mess
api.put('/messs/:_id', reqMembre, addLogin, assertSubject(MessServ), getSubject(MessServ), reqOwn('mess'),
    function (req, res) {

        MessServ.edit(req.subject, req.body, ensureExists(res, 404, function (mess) {
            MessServ.simpleData(mess, giveBack(res, 201));
        }));
    });

// Supression d'un mess
api.delete('/messs/:_id', reqMembre, getSubject(MessServ), reqOwn('mess'), delSubject(MessServ));

api.all('/coffee', function (req, res) {
    res.status(418).end();
});

api.all('*', function (req, res) {
    res.status(405).end();
});

module.exports = api;
