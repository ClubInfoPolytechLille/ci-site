angular.module('SessionsCtrl', []).controller('SessionController', ['$scope', '$http', 'SessionService',
    function ($scope, $http, SessionService) {
        $scope.session = {
            logged: true,
            name: SessionService.get()
        }

        $scope.disconnect = function () {
            $scope.session.logged = false;
        }
    }
]);