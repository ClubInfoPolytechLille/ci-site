var Membre = require('../models/membre');

var membres = {}

membres.list = function (cb) {
    Membre.find(cb);
}

membres.add = function (data, cb) {
    Membre.create({
        login: data.login,
        role: data.role,
        section: data.section,
    }, cb);
}

membres.delete = function (id, cb) {
    Membre.remove({
        _id: id
    }, cb);
}

module.exports = membres;