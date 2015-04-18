angular.module('ForumConvCtrl', ['SessionsServ', 'ApiServ', 'MessEditDrct'])
    .controller('ForumConvCtrl', function ($scope, $routeParams, SessionServ, ApiServ) {
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
                    if (!err) {
                        $scope.messs = messs;
                    }
                });
            }
        });

        $scope.addMess = function () {
            data = {
                content: $scope.mess.content,
                conv: $scope.conv._id
            };
            ApiServ("envoi du message", 'post', 'messs', data, function (err, mess) {
                if (!err) {
                    $scope.formData = {};
                    $scope.messs.push(mess);
                }
            });
        };

        $scope.delMess = function (index) {
            ApiServ("suppression du message", 'delete', 'messs', $scope.messs[index]._id, function (err) {
                if (!err)
                    $scope.messs.splice(index, 1);
            });
        };

        $scope.editButton = function (index) {
            mess = $scope.messs[index];
            if (mess.editMode) {
                mess.viewSource = false;
                console.log('Submit edition');
            } else {
                mess.viewSource = true;
            }
            mess.editMode = !mess.editMode;
        };

    });
