var Session = require('../models/session');

var sessions = {}

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
    Session.findById(id, function (err, session) {
        if (err) {
            cb('error');
        } else {
            if (session) {
                if (sessions.valid(session)) {
                    cb(err, session);
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

sessions.create = function (login, cb) {
    Session.create({
        login: login
    }, cb);
}

sessions.login = function (data, cb) {
    // DUMMY
    if (data.login == 'cool' && data.pass == 'cool') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

sessions.open = function (data, cb) {
    sessions.login(data, function (err, res) {
        if (err) {
            cb('error')
        } else {
            if (res) {
                sessions.create(data.login, function (err, session) {
                    if (err) {
                        cb('error');
                    } else {
                        cb(session);
                    }
                });
            } else {
                cb('invalid')
            }
        }
    });
}

module.exports = sessions;