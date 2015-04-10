angular.module('ForumServ', ['NotifyServ']).service('ForumServ', ['$http', 'NotifyServ',
    function ($http, NotifyServ) {
        a = {
            getConv: function (id, cb) {
                $http.get('/api/convs/' + id)
                    .success(function (data) {
                        cb(null, data);
                    })
                    .error(function (data) {
                        NotifyServ.error("Impossible d'obtenir la conv", data);
                    });
            },

            getConvs: function (cb) {
                // TODO Dirs
                $http.get('/api/convs')
                    .success(function (data) {
                        cb(null, data);
                    })
                    .error(function (data) { // TODO CBs
                        NotifyServ.error("Impossible d'obtenir la liste des convs", data);
                    });
            },

            createConv: function (data, cb) {
                var not = NotifyServ.promise("Ajout du conv...");
                $http.post('/api/convs', data)
                    .success(function (conv) {
                        not.success("Conv ajouté");
                        cb(null, conv);
                    })
                    .error(function (data) {
                        not.error("Impossible d'ajouter le conv");
                    });
            },

            deleteConv: function (id, cb) {
                var not = NotifyServ.promise("Suppression du conv...");
                $http.delete('/api/convs/' + id)
                    .success(function (conv) {
                        not.success("Conv supprimé");
                        cb(null);
                    })
                    .error(function (data) {
                        not.error("Impossible de supprimer le conv", data);
                    });
            },

            // Message
            getMesss: function (conv, cb) {
                // TODO Dirs
                $http.get('/api/messs/' + conv)
                    .success(function (data) {
                        cb(null, data);
                    })
                    .error(function (data) { // TODO CBs
                        NotifyServ.error("Impossible d'obtenir la liste des messs", data);
                    });
            },

            createMess: function (data, cb) {
                var not = NotifyServ.promise("Ajout du mess...");
                $http.post('/api/messs', data)
                    .success(function (mess) {
                        not.success("Mess ajouté");
                        cb(null, mess);
                    })
                    .error(function (data) {
                        not.error("Impossible d'ajouter le mess");
                    });
            },

            deleteMess: function (id, cb) {
                var not = NotifyServ.promise("Suppression du mess...");
                $http.delete('/api/messs/' + id)
                    .success(function (mess) {
                        not.success("Mess supprimé");
                        cb(null);
                    })
                    .error(function (data) {
                        not.error("Impossible de supprimer le mess", data);
                    });
            }
        };
        return a;
    }
]);
