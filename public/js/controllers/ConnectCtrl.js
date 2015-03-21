angular.module('ConnectCtrl', []).controller('ConnectController', ['$scope', 'SessionService',
    function ($scope, SessionService) {
        $scope.connect = {
            connect: function () {
                SessionService.connect($scope.connect.login, $scope.connect.pass)
            }
        }
    }
]);