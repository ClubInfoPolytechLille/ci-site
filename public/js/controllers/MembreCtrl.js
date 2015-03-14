angular.module('MembreCtrl', []).controller('MembreController', ['$scope', '$http',
    function ($scope, $http) {
        $scope.formData = {};

        // when landing on the page, get all Membres and show them
        $http.get('/api/membres')
            .success(function (data) {
                $scope.membres = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        $scope.createMembre = function () {
            console.log('Adding', $scope.formData);
            $http.post('/api/membres', $scope.formData)
                .success(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.membres = data;
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        // delete a Membre after checking it
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