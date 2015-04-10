angular.module('ForumConvCtrl', ['SessionsServ', 'ForumServ', 'NotifyServ']).controller('ForumConvCtrl', ['$scope', '$routeParams', 'SessionServ', 'ForumServ', 'NotifyServ',
    function ($scope, $routeParams, SessionServ, ForumServ, NotifyServ) {
        $scope.messs = [];
        $scope.conv = {};
        $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });
        ForumServ.getConv($routeParams.conv_id, function (err, conv) {
            if (!err)
                $scope.conv = conv;
            ForumServ.getMesss(conv._id, function (err, messs) {
                if (!err)
                    $scope.messs = messs;
            });
        });

        $scope.createMess = function () {
            data = $scope.formData;
            data.conv = $scope.conv._id;
            ForumServ.createMess(data, function (err, mess) {
                console.log(mess);
                if (!err)
                    $scope.formData = {};
                $scope.messs.push(mess);
            });
        };

        $scope.deleteMess = function (index) {
            ForumServ.deleteMess($scope.messs[index]._id, function (err) {
                if (!err)
                    $scope.messs.splice(index, 1);
            });
        };

    }
]);
