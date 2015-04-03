var Client = require('ssh2').Client;

var creds = require('../../config/sshAuth');

var SshAuth = {};

SshAuth.verify = function (login, pass, cb) {
    var conn = new Client();
    conn.on('ready', function () {
        cb(null, true);
    }).on('error', function(err) {
        if (err.level === 'client-authentication') {
            cb(null, false);
        } else {
            cb(err);
        }
    }).connect({
        host: creds.host,
        port: creds.port,
        username: login,
        password: pass
    });
};

module.exports = SshAuth;
