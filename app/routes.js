var path = require('path');
var api = require('./routes/ApiRtes');

module.exports = function (app) {

    app.use('/api/', api);

    app.get('*', function (req, res) {
        if (req.accepts('text/html')) {
            res.sendFile('public/views/index.html', {
                root: path.normalize(__dirname + '/..')
            });
        } else {
            res.send(404).end();
        }
    });

    app.all('*', function (req, res) {
        res.send(405).end();
    });

};
