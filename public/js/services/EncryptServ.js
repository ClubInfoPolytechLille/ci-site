angular.module('EncryptServ', []).service('EncryptService', ['$http',
    function ($http) {
        a = {
            encrypter: false,
            whenOk: function (cb) {
                if (this.encrypter) {
                    cb();
                } else {
                    this.prepare(cb);
                }
            },
            prepare: function (cb) {
                $http.get('/com/ci_com_pub.pem').success(function (key) {
                    this.encrypter = new JSEncrypt();
                    this.encrypter.setPublicKey(key);
                    cb();
                });
            },
            preload: function (cb) {
                this.whenOk(cb);
            },
            encrypt: function (string, cb) {
                this.whenOk(function () {
                    cb(this.encrypter.encrypt(string));
                });
            }
        };
        return a;
    }
]);
