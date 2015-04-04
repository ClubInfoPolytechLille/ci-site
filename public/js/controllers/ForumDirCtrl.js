angular.module('ForumDirCtrl', ['SessionsServ', 'ForumServ', 'NotifyServ']).controller('ForumDirCtrl', ['$scope', 'SessionServ', 'ForumServ', 'NotifyServ',
    function ($scope, SessionServ, ForumServ, NotifyServ) {
        $scope.convs = [];
        $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });

        ForumServ.getConvs(function(err, convs) {
            if (!err)
                $scope.convs = convs;
        });

        $scope.createConv = function () {
            ForumServ.createConv($scope.formData, function(err, conv) {
                if (!err)
                    $scope.convs.push(conv);
            });
        };

        $scope.deleteConv = function (index) {
            ForumServ.deleteConv($scope.convs[index]._id, function(err) {
                if (!err)
                    $scope.convs.splice(index, 1);
            });
        };

    }
]);
