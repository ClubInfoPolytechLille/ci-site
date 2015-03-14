var Membre = require('./models/membre');

module.exports = function (app) {

    app.get('/api/membres', function (req, res) {
        Membre.find(function (err, membres) {
            if (err)
                res.send(err);
            res.json(membres);
        });
    });
    app.post('/api/membres', function (req, res) {
        Membre.create({
            login: req.body.login,
            role: req.body.role,
            section: req.body.section,
        }, function (err, membre) {
            if (err)
                res.send(err);
            Membre.find(function (err, membres) {
                if (err)
                    res.send(err);
                res.json(membres);
            });
        });
    });
    app.delete('/api/membres/:membre_id', function (req, res) {
        Membre.remove({
            _id: req.params.membre_id
        }, function (err, membre) {
            if (err)
                res.send(err);
            Membre.find(function (err, membres) {
                if (err)
                    res.send(err);
                res.json(membres);
            });
        })
    })

    app.get('*', function (req, res) {
        res.sendfile('./public/views/index.html');
    });

};