var path = require('path');
var api = require('./routes/api');

module.exports = function (app) {

    app.use('/api/', api);

    app.get('*', function (req, res) {
        res.sendFile('public/views/index.html', { root: path.normalize(__dirname + '/..') });
    });

};
