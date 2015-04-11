angular.module('SessionsServ', ['NotifyServ', 'EncryptServ'])
    .service('SessionServ', function ($http, EncryptServ, NotifyServ) {
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
                    NotifyServ.warn("Session expirée");
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
                var not = NotifyServ.promise("Connexion...");
                data = JSON.stringify({
                    login: login,
                    pass: pass
                });
                EncryptServ.encrypt(data, function (dataCrypt) {
                    $http.post('/api/session', [dataCrypt]).success(function (body) {
                        _this.updateSessionInfos(body);
                        if (_this.cur) {
                            not.success("Connecté en tant que <strong>" + _this.cur.nom + "</strong>");
                            cb(null);
                        } else {
                            if (body === 'invalid') {
                                not.warn("Identifiants invalides");
                            }
                            cb(body);
                        }
                    }).error(function (data, status) {
                        err = status + (data ? ' : ' + JSON.stringify(data) : '');
                        not.error("Impossible de se connecter", err);
                        cb(err);
                    });
                });
            },
            disconnect: function () {
                _this = this;
                var not = NotifyServ.promise("Déconnexion...");
                $http.delete('/api/session').success(function () {
                    _this.updateSessionInfos(false);
                    not.success("Déconnecté");
                }).error(function (body) {
                    not.error("Impossible de se déconnecter", body);
                });
            }
        };
        a.get();
        return a;
    });
