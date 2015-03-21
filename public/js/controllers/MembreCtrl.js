angular.module('MembreCtrl', []).controller('MembreController', ['$scope', '$http', 'SessionService',
    function ($scope, $http, SessionService) {
        $scope.formData = {};

        $scope.session = SessionService.cur
        SessionService.onChange(function () {
            $scope.session = SessionService.cur
        })

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