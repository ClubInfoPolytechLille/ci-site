angular.module('MembreCtrl', []).controller('MembreCtrl', ['$scope', '$http', 'SessionServ',
    function ($scope, $http, SessionServ) {
        $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });

        $http.get('/api/membres')
            .success(function (data) {
                $scope.membres = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        $scope.createMembre = function () {
            console.log('Adding', $scope.formData);
            $http.post('/api/membres', $scope.formData)
                .success(function (data) {
                    $scope.formData = {};
                    $scope.membres = data;
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        $scope.deleteMembre = function (id) {
            $http.delete('/api/membres/' + id)
                .success(function (data) {
                    $scope.membres = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

    }
]);
