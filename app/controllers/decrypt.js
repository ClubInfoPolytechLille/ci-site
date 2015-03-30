var ursa = require('ursa');
var fs = require('fs');

var decrypt = {};

decrypt.decrypter = false;

decrypt.whenOk = function (cb) {
  if (this.encrypter) {
    cb();
  } else {
    this.prepare(cb);
  }
};

decrypt.prepare = function (cb) {
  fs.readFile('config/ci_com.pem', function(err, data) {
    if (err) {
      throw err;
    }
    this.decrypter = ursa.createPrivateKey(data);
    cb();
  });
};

decrypt.preload = function(cb) {
  this.whenOk(cb);
};

decrypt.decrypt = function (string, cb) {
  this.whenOk(function() {
    cb(this.decrypter.decrypt(string, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING));
  });
};

module.exports = decrypt;
