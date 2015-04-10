var SessionModl = require('../models/SessionModl');
var NomsServ = require('../services/NomsServ');
var SshAuthServ = require('../services/SshAuthServ');

var sessions = {};

sessions.cur = false;

sessions.addData = function (session, cb) {
    NomsServ.get(session.login, function (nom) {
        // Nom
        session.nom = nom.nom;
        session.section = nom.section;
        // Permissions
        session.canAddMembre = session.login == 'gbontoux';
        session.canDelMembre = session.login == 'gbontoux';
        session.canAddConv = true;
        session.canDelConv = session.login == 'gbontoux';
        session.canAddMess = true;
        session.canDelMess = session.login == 'gbontoux';
        cb(session);
    });
};

sessions.find = function (id, cb) {
    _this = this;
    SessionModl.findById(id).lean().exec(function (err, session) {
        if (typeof session == 'object') {
            _this.addData(session, function (session) {
                cb(err, session);
            });
        } else {
            cb(err, null);
        }
    });
};

sessions.valid = function (session) {
    return session.started.setSeconds(session.started.getSeconds() + 3600) > new Date();
};

sessions.delete = function (id, cb) {
    SessionModl.remove({
        _id: id
    }, cb);
};

sessions.verify = function (id, cb) {
    _this = this;
    _this.find(id, function (err, session) {
        if (err) {
            cb('error');
        } else {
            if (session) {
                if (sessions.valid(session)) {
                    cb(null, session);
                } else {
                    cb('expired');
                    _this.delete(id);
                }
            } else {
                cb('unknown');
            }
        }
    });
};

sessions.use = function (id, cb) {
    _this = this;
    _this.verify(id, function (err, session) {
        if (err) {
            cb(err);
        } else {
            _this.cur = session; // TODO Get rid of _this.cur
            cb(null);
        }
    });
};

sessions.create = function (login, cb) {
    SessionModl.create({
        login: login
    }, cb);
};

sessions.login = function (data, cb) {
    SshAuthServ.verify(data.login, data.pass, cb);
};

sessions.open = function (data, cb) {
    _this = this;
    _this.login(data, function (err, res) {
        if (err) {
            cb('error');
        } else {
            if (res) {
                _this.create(data.login, function (err, session) {
                    if (err) {
                        cb('error');
                    } else {
                        _this.use(session._id, cb);
                    }
                });
            } else {
                cb('invalid');
            }
        }
    });
};

module.exports = sessions;
