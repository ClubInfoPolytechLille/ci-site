var DossModl = require('../models/DossModl');
var ConvsServ = require('../services/ConvsServ');
var async = require('async');

var DosssServ = {};

(function init() {
    DossModl.find({
        special: 'root'
    }).exec(function (err, data) {
        if (data.length < 1) {
            DossModl.create({
                special: 'root',
                titre: 'Racine'
            });
        }
    });
    DossModl.find({
        special: 'trash'
    }).exec(function (err, data) {
        if (data.length < 1) {
            DossModl.create({
                special: 'trash',
                titre: 'Corbeille'
            });
        }
    });
})();

DosssServ.simple = ['_id', 'titre', 'parent', 'special', 'hidden'];

DosssServ.simpleData = function (dossD, cb) {
    var doss = {};
    for (var prop of DosssServ.simple) {
        doss[prop] = dossD[prop];
    }
    // TODO Dernier message
    cb(null, doss);
};


DosssServ.detailedData = function (dossD, cb) {
    async.parallel([
        function (cba) {
            var doss = {};
            for (var prop of DosssServ.simple) {
                doss[prop] = dossD[prop];
            }
            cba(null, doss);
        },
        function (cba) {
            DosssServ.children(dossD._id, function (err, children) {
                if (err) {
                    cba(err);
                } else {
                    async.map(children, DosssServ.simpleData, cba);
                }
            });
        },
        function (cba) {
            ConvsServ.children(dossD._id, function (err, children) {
                if (err) {
                    cba(err);
                } else {
                    async.map(children, ConvsServ.simpleData, cba);
                }
            });
        }
    ], function (err, res) {
        if (err) {
            cb(err);
        } else {
            doss = res[0];
            doss.dosss = res[1];
            doss.convs = res[2];
            cb(null, doss);
        }
    });
};

DosssServ.get = function (special, cb) {
    console.log(special);
    DossModl.findById(special).exec(function (err, doss) {
        if (!err && doss) {
            cb(null, doss);
        } else {
            DossModl.findOne({
                special: special
            }).exec(function (err2, doss) {
                if (err2) {
                    cb(err);
                } else {
                    cb(null, doss ? doss : null);
                }
            });
        }
    });
};

DosssServ.children = function (id, cb) {
    DossModl.find({
        parent: id,
        $or: [{
            hidden: false
        }, {
            hidden: undefined
        }]
    }, cb);
};

DosssServ.assert = function (data, cb) {
    cb(data.titre && data.parent);
};

DosssServ.add = function (data, cb) {
    DossModl.create({
        titre: data.titre,
        parent: data.parent
    }, cb);
};

DosssServ.remove = function (id, cb) {
    async.waterfall([function (cba) {
        DosssServ.get(id, cba);
    }, function (doss, cba) {
        cba(doss ? null : 'notfound', doss);
    }, function (doss, cba) {
        doss.parent = 'trash';
        doss.save(cba);
    }], cb);
};

module.exports = DosssServ;
