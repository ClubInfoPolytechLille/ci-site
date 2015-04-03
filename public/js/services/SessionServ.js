angular.module('SessionsServ', ['NotifyServ', 'EncryptServ']).service('SessionServ', ['$http', 'EncryptServ', 'NotifyServ',
    function ($http, EncryptServ, NotifyServ) {
        a = {
            cur: false,
            changeHandlers: [],
            onChange: function (fun) {
                this.changeHandlers.push(fun);
            },
            triggerChange: function () {
                for (var fun in this.changeHandlers) {
                    this.changeHandlers[fun]();
                }
            },
            updateSessionInfos: function (data) {
                if (typeof data === 'object') {
                    this.cur = data;
                } else if (data === 'expired') {
                    NotifyServ.warn("Votre session a expiré");
                } else {
                    this.cur = false;
                }
                this.triggerChange();
            },
            get: function (cb) { // Fetch infos if needed
                _this = this;
                // TODO Verify if cookies to prevent uneeded request
                $http.get('/api/session').success(function (body) {
                    _this.updateSessionInfos(body);
                    if (cb) {
                        if (this.logged) {
                            cb(null);
                        } else {
                            cb(body);
                        }
                    }
                });
            },
            connect: function (login, pass, cb) {
                _this = this;
                data = JSON.stringify({
                    login: login,
                    pass: pass
                });
                EncryptServ.encrypt(data, function (dataCrypt) {
                    $http.post('/api/session', [dataCrypt]).success(function (body) {
                        _this.updateSessionInfos(body);
                        if (_this.cur) {
                            NotifyServ.info("Connecté en tant que <strong>" + _this.cur.nom + "</strong>");
                            if (cb)
                                cb(null);
                        } else {
                            if (body === 'invalid') {
                                NotifyServ.warn("Identifiants invalides");
                            }
                            if (cb)
                                cb(body);
                        }
                    });
                });
            },
            disconnect: function () {
                _this = this;
                $http.delete('/api/session').success(function () {
                    _this.updateSessionInfos(false);
                    NotifyServ.info("Déconnecté");
                });
            }
        };
        a.get();
        return a;
    }
]);
