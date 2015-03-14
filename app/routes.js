// app/routes.js

// grab the nerd model we just created
var Nerd = require('./models/nerd');

module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/nerds', function (req, res) {
        // use mongoose to get all nerds in the database
        Nerd.find(function (err, nerds) {
            if (err)
                res.send(err);
            res.json(nerds);
        });
    });
    app.post('/api/nerds', function (req, res) {
        Nerd.create({
            login: req.body.login,
            role: req.body.role,
            section: req.body.section,
        }, function (err, nerd) {
            if (err)
                res.send(err);
            Nerd.find(function (err, nerds) {
                if (err)
                    res.send(err);
                res.json(nerds);
            });
        });
    });
    app.delete('/api/nerds/:nerd_id', function (req, res) {
        Nerd.remove({
            _id: req.params.nerd_id
        }, function (err, nerd) {
            if (err)
                res.send(err);
            Nerd.find(function (err, nerds) {
                if (err)
                    res.send(err);
                res.json(nerds);
            });
        })
    })

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};