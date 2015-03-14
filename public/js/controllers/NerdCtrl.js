// public/js/controllers/NerdCtrl.js
angular.module('NerdCtrl', []).controller('NerdController', function ($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all Nerds and show them
    $http.get('/api/nerds')
        .success(function (data) {
            $scope.nerds = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createNerd = function () {
        console.log('Adding', $scope.formData);
        $http.post('/api/nerds', $scope.formData)
            .success(function (data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.nerds = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // delete a Nerd after checking it
    $scope.deleteNerd = function (id) {
        $http.delete('/api/nerds/' + id)
            .success(function (data) {
                $scope.nerds = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

});