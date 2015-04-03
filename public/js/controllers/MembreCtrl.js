angular.module('MembreCtrl', []).controller('MembreCtrl', ['$scope', '$http', 'SessionServ', 'NotifyServ',
    function ($scope, $http, SessionServ, NotifyServ) {
        $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });

        $http.get('/api/membres')
            .success(function (data) {
                $scope.membres = data;
            })
            .error(function (data) {
                NotifyServ.error("Impossible d'obtenir la liste des membres", data);
            });

        $scope.createMembre = function () {
            $http.post('/api/membres', $scope.formData)
                .success(function (data) {
                    $scope.formData = {};
                    $scope.membres = data;
                    NotifyServ.success("Membre ajouté");
                })
                .error(function (data) {
                    NotifyServ.error("Impossible d'ajouter le membre", data);
                });
        };

        $scope.deleteMembre = function (id) {
            $http.delete('/api/membres/' + id)
                .success(function (data) {
                    $scope.membres = data;
                    NotifyServ.success("Membre supprimé.");
                })
                .error(function (data) {
                    NotifyServ.error("Impossible de supprimer le membre", data);
                });
        };

    }
]);
