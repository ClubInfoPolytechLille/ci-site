angular.module('ProfileCtrl', ['SessionsServ', 'ApiServ'])
    .controller('ProfileCtrl', function ($scope, SessionServ, ApiServ) {
        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });
        $scope.disconnect = function () {
            SessionServ.disconnect();
        };
    });
