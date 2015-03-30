var api = require('./routes/api');

module.exports = function (app) {

    app.use('/api/', api);

    app.get('*', function (req, res) {
        res.sendfile('./public/views/index.html');
    });

};
