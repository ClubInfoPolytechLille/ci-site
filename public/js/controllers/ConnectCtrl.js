angular.module('ConnectCtrl', []).controller('ConnectCtrl', ['$scope', 'SessionServ', 'EncryptServ',
    function ($scope, SessionServ, EncryptServ) {
        EncryptServ.preload(function () {
            return undefined;
        });
        $scope.connect = {
            connect: function () {
                SessionServ.connect($scope.connect.login, $scope.connect.pass);
            }
        };
    }
]);
