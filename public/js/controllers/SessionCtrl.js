angular.module('SessionsCtrl', ['SessionsServ']).controller('SessionCtrl', ['$scope', 'SessionServ',
    function ($scope, SessionServ) {
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
    }
]);
