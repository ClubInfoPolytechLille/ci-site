angular.module('SessionsCtrl', ['SessionsServ'])
    .controller('NavbarCtrl', function ($scope, SessionServ) {
        $scope.isCollapsed = false;
        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });
        // $scope.$on("$destroy", function () {
        //     // TODO
        // })
    });
