angular.module('SessionsServ', []).service('SessionService', ['$http',
    function ($http) {
        a = {
            name: "Invité",
            logged: false,
            status: 0,
            changeHandlers: [],
            onChange: function (fun) {
                this.changeHandlers.push(fun)
            },
            triggerChange: function () {
                for (fun in this.changeHandlers) {
                    this.changeHandlers[fun]()
                }
            },
            updateSessionInfos: function (data) {
                if (typeof data === 'object') {
                    console.log("Connected")
                    this.logged = true
                    this.name = data.login
                } else {

                    this.logged = false
                }
                this.triggerChange()
            },
            get: function (cb) { // Fetch infos if needed
                console.log("Session: get")
                if (status == 0) {
                    this.status = 1 // Fetching
                    _this = this
                    // TODO Verify if cookies to prevent uneeded request
                    $http.get('/api/session').success(function (body) {
                        _this.updateSessionInfos(body)
                        if (cb) {
                            if (this.logged) {
                                cb(null)
                            } else {
                                cb(body)
                            }
                        }
                    })
                } else {
                    console.warn("get multiple times")
                }
            },
            connect: function (login, pass, cb) {
                console.log("Session: connecting with login:", login)
                _this = this
                $http.post('/api/session', {
                    login: login,
                    pass: pass
                }).success(function (body) {
                    _this.updateSessionInfos(body)
                    if (cb) {
                        if (this.logged) {
                            cb(null)
                        } else {
                            cb(body)
                        }
                    }
                })
            },
            disconnect: function () {
                console.log("Session: disconnect", this.name)
                $http.delete('/api/session')
                this.logged = false
            }
        }
        a.get()
        return a
    }
])