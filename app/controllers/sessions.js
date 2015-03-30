var Session = require('../models/session');
var noms = require('../controllers/noms');

var sessions = {}

sessions.cur = false

sessions.addData = function (session, cb) {
    noms.get(session.login, function (nom) {
        if (typeof nom == 'string') {
            session.nom = nom
        } else {
            session.nom = 'Inconnu'
        }
        session.canAddMembre = session.login == 'gbontoux'
        session.canDelMembre = session.login == 'gbontoux'
        cb(session)
    })
}

sessions.find = function (id, cb) {
    _this = this
    Session.findById(id).lean().exec(function (err, session) {
        if (typeof session == 'object') {
            _this.addData(session, function (session) {
                cb(err, session)
            })
        } else {
            cb(err, null)
        }
    })
}

sessions.valid = function (session) {
    return session.started.setSeconds(session.started.getSeconds() + 3600) > new Date()
}

sessions.delete = function (id, cb) {
    Session.remove({
        _id: id
    }, cb);
}

sessions.verify = function (id, cb) {
    _this = this
    _this.find(id, function (err, session) {
        if (err) {
            cb('error');
        } else {
            if (session) {
                if (sessions.valid(session)) {
                    cb(null, session);
                } else {
                    cb('expired');
                    _this.delete(id)
                }
            } else {
                cb('unknown')
            }
        }
    });
}

sessions.use = function (id, cb) {
    _this = this
    _this.verify(id, function (err, session) {
        if (err) {
            cb(err)
        } else {
            _this.cur = session
            cb(null)
        }
    })
}

sessions.create = function (login, cb) {
    Session.create({
        login: login
    }, cb);
}

sessions.login = function (data, cb) {
    // DUMMY
    noms.get(data.login, function (nom) {
        if (nom == false) {
            cb(null, false)
        } else {
            if (data.pass == 'cool') {
                cb(null, true)
            } else {
                cb(null, false)
            }
        }
    })
}

sessions.open = function (data, cb) {
    _this = this
    _this.login(data, function (err, res) {
        if (err) {
            cb('error')
        } else {
            if (res) {
                _this.create(data.login, function (err, session) {
                    if (err) {
                        cb('error');
                    } else {
                        _this.use(session._id, cb)
                    }
                });
            } else {
                cb('invalid')
            }
        }
    });
}

module.exports = sessions;
