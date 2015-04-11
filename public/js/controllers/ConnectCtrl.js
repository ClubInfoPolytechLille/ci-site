angular.module('ConnectCtrl', ['SessionsServ', 'EncryptServ', 'angular-ladda'])
    .controller('ConnectCtrl', function ($scope, SessionServ, EncryptServ) {
        EncryptServ.preload(function () {
            return undefined;
        });
        $scope.connecting = false;
        $scope.connect = {
            connect: function () {
                $scope.connecting = true;
                SessionServ.connect($scope.connect.login, $scope.connect.pass, function (err) {
                    $scope.connecting = false;
                    if (!err) {
                        window.history.back();
                    }
                });
            }
        };
    });
