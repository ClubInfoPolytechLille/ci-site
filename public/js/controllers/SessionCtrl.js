angular.module('SessionsCtrl', []).controller('SessionController', ['$scope', 'SessionService',
    function ($scope, SessionService) {
        $scope.session = SessionService
        // $scope.session.onChange(function () {
        //     // TODO
        // })
        // $scope.$on("$destroy", function () {
        //     // TODO
        // })
    }
]);