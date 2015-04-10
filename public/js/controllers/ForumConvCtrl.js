angular.module('ForumConvCtrl', ['SessionsServ', 'ApiServ']).controller('ForumConvCtrl', ['$scope', '$routeParams', 'SessionServ', 'ApiServ',
    function ($scope, $routeParams, SessionServ, ApiServ) {
        $scope.messs = [];
        $scope.conv = {};
        $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });
        ApiServ("récupération de la conversation", 'get', 'convs', $routeParams.conv_id, function (err, conv) {
            if (!err) {
                $scope.conv = conv;
                ApiServ("récupération des messages", 'get', 'messs', conv._id, function (err, messs) {
                    if (!err)
                        $scope.messs = messs;
                });
            }
        });

        $scope.createMess = function () {
            data = $scope.formData;
            data.conv = $scope.conv._id;
            ApiServ("envoi du message", 'post', 'messs', data, function (err, mess) {
                if (!err)
                    $scope.formData = {};
                $scope.messs.push(mess);
            });
        };

        $scope.deleteMess = function (index) {
            ApiServ("suppression du message", 'delete', 'messs', $scope.messs[index]._id, function (err) {
                if (!err)
                    $scope.messs.splice(index, 1);
            });
        };

    }
]);
