angular.module('ApiServ', ['NotifyServ'])
    .service('ApiServ', function ($http, NotifyServ) {
        return function (name, method, href) {
            var cb;
            link = '/api/' + href;
            arglen = arguments.length;
            if (typeof arguments[arglen - 1] == 'function') {
                cb = arguments[arglen - 1];
                arglen--;
            } else {
                cb = function () {
                    return undefined;
                };
            }

            if (method == 'get' || method == 'delete') { // TODO url & data en même temps
                for (arg = 3; arg < arglen; arg++) {
                    link += '/' + arguments[arg];
                }
                request = $http[method](link);
            } else {
                request = $http[method](link, arguments[3]);
            }
            request
                .success(function (data) {
                    cb(null, data);
                })
                .error(function (data, status) {
                    cb(status);
                    NotifyServ.error("Échec : " + name, status + (data ? ' : ' + JSON.stringify(data) : ''));
                    // console.error(name, status, data);
                });
        };
    });
