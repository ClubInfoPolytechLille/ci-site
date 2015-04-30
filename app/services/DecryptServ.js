var ursa = require('ursa');
var fs = require('fs');

var DecryptServ = {

    decrypter: false,

    whenOk: function (cb) {
        if (this.encrypter) {
            cb();
        } else {
            this.prepare(cb);
        }
    },

    prepare: function (cb) { // TODO Juste charger au lancement du script
        fs.readFile('config/ci_com.pem', function (err, data) {
            if (err) {
                throw err;
            }
            this.decrypter = ursa.createPrivateKey(data);
            cb();
        });
    },

    preload: function (cb) {
        this.whenOk(cb);
    },

    decrypt: function (string, cb) {
        this.whenOk(function () {
            cb(this.decrypter.decrypt(string, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING));
        });
    }
};

module.exports = DecryptServ;
