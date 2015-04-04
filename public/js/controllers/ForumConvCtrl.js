angular.module('ForumConvCtrl', ['SessionsServ', 'ForumServ', 'NotifyServ']).controller('ForumConvCtrl', ['$scope', '$routeParams', 'SessionServ', 'ForumServ', 'NotifyServ',
    function ($scope, $routeParams, SessionServ, ForumServ, NotifyServ) {
        $scope.conv = {};
        // $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });
        ForumServ.getConv($routeParams.conv_id, function(err, conv) {
            if (!err)
                $scope.conv = conv;
        });
        //
        // $scope.createConv = function () {
        //     ForumServ.createConv($scope.formData, function(err, conv) {
        //         if (!err)
        //             $scope.formData = {};
        //             $scope.convs.push(conv);
        //     });
        // };
        //
        // $scope.deleteConv = function (index) {
        //     ForumServ.deleteConv($scope.convs[index]._id, function(err) {
        //         if (!err)
        //             $scope.convs.splice(index, 1);
        //     });
        // };

    }
]);
