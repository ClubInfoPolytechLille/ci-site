angular.module('ForumDirCtrl', ['SessionsServ', 'ApiServ']).controller('ForumDirCtrl', ['$scope', 'SessionServ', 'ApiServ', function ($scope, SessionServ, ApiServ) {
    $scope.convs = [];
    $scope.formData = {};

    $scope.session = SessionServ.cur;
    SessionServ.onChange(function () {
        $scope.session = SessionServ.cur;
    });

    ApiServ("récupération des conversations", 'get', 'convs', function (err, convs) {
        if (!err)
            $scope.convs = convs;
    });

    $scope.createConv = function () {
        ApiServ("création de la conversation", 'post', 'convs', $scope.formData, function (err, conv) {
            if (!err) {
                $scope.formData = {};
                $scope.convs.push(conv);
            }
        });
    };

    $scope.deleteConv = function (index) {
        ApiServ("création de la conversation", 'delete', 'convs', $scope.convs[index]._id, function (err) {
            if (!err)
                $scope.convs.splice(index, 1);
        });
    };

}]);
