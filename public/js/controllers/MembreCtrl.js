angular.module('MembreCtrl', ['SessionsServ', 'ApiServ']).controller('MembreCtrl', ['$scope', '$http', 'SessionServ', 'ApiServ',
    function ($scope, $http, SessionServ, ApiServ) {
        $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });

        ApiServ("récupération de la liste des membres", 'get', 'membres', function (err, membres) {
            if (!err)
                $scope.membres = membres;
        });

        $scope.createMembre = function () {
            ApiServ("création du membre", 'post', 'membres', $scope.formData, function (err, membre) {
                if (!err) {
                    $scope.formData = {};
                    $scope.membres.push(membre);
                }
            });
        };

        $scope.deleteMembre = function (index) {
            ApiServ("création du membre", 'delete', 'membres', $scope.membres[index]._id, function (err, data) {
                if (!err) {
                    $scope.membres.splice(index, 1);
                }
            });
        };
    }
]);
