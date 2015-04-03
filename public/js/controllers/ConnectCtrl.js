angular.module('ConnectCtrl', []).controller('ConnectCtrl', ['$scope', 'SessionServ', 'EncryptServ',
    function ($scope, SessionServ, EncryptServ) {
        EncryptServ.preload(function () {
            return undefined;
        });
        $scope.connecting = false;
        $scope.connect = {
            connect: function () {
                $scope.connecting = true;
                SessionServ.connect($scope.connect.login, $scope.connect.pass, function() {
                    $scope.connecting = false;
                });
            }
        };
    }
]);
