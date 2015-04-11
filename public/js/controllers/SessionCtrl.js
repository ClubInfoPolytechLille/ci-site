angular.module('SessionsCtrl', ['SessionsServ'])
    .controller('SessionCtrl', function ($scope, SessionServ) {
        $scope.isCollapsed = false;
        $scope.session = SessionServ.cur;
        $scope.disconnect = function () {
            SessionServ.disconnect();
        };
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });
        // $scope.$on("$destroy", function () {
        //     // TODO
        // })
    });
