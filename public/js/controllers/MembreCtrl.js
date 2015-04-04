angular.module('MembreCtrl', ['SessionsServ', 'NotifyServ']).controller('MembreCtrl', ['$scope', '$http', 'SessionServ', 'NotifyServ',
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
            var not = NotifyServ.promise("Ajout du membre...");
            $http.post('/api/membres', $scope.formData)
                .success(function (membre) {
                    $scope.formData = {};
                    $scope.membres.push(membre);
                    not.success("Membre ajouté");
                })
                .error(function (data) {
                    not.error("Impossible d'ajouter le membre");
                });
        };

        $scope.deleteMembre = function (index) {
            var not = NotifyServ.promise("Suppression du membre...");
            $http.delete('/api/membres/' + $scope.membres[index]._id)
                .success(function (membre) {
                    $scope.membres.splice(index, 1);
                    not.success("Membre supprimé");
                })
                .error(function (data) {
                    not.error("Impossible de supprimer le membre", data);
                });
        };

    }
]);
