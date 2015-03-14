var Session = require('../models/session');

var sessions = {}

sessions.find = function (id, cb) {
    Session.find({
        '_id': id
    }, cb)
}

sessions.valid = function (session) {
    return session.started + 3600 > Date.now()
}

sessions.delete = function (id, cb) {
    Session.remove({
        _id: id
    }, cb);
}

sessions.close = function (id, cb) {

}

sessions.verify = function (id, cb) {
    session.find(id, function (err, session) {
        if (err) {
            cb('error');
        } else {
            if (sessions.valid(session)) {
                cb(session);
            } else {
                cb('expired');
                sessions.delete(id)
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