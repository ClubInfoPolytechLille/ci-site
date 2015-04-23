angular.module('ApiServ', ['NotifyServ'])
    .service('ApiServ', function ($http, NotifyServ) {
        return function (name, method, params, data, cb) {
            if (!cb) {
                cb = function () {
                    return undefined;
                };
            }

            link = '/api';
            if (typeof params == 'string') {
                params = [params];
            }
            for (var param in params) {
                link += '/' + params[param];
            }
            $http[method](link, data)
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
