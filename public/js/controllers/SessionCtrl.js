angular.module('SessionsCtrl', []).controller('SessionController', ['$scope', 'SessionService',
    function ($scope, SessionService) {
        $scope.session = SessionService.cur;
        $scope.disconnect = function () {
            SessionService.disconnect();
        };
        SessionService.onChange(function () {
                $scope.session = SessionService.cur;
            });
            // $scope.$on("$destroy", function () {
            //     // TODO
            // })
    }
]);
