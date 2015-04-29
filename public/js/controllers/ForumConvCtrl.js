angular.module('ForumConvCtrl', ['SessionsServ', 'ApiServ', 'MessEditDrct'])
    .controller('ForumConvCtrl', function ($scope, $routeParams, SessionServ, ApiServ) {
        $scope.conv = {};
        $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });
        ApiServ("récupération de la conversation", 'get', ['convs', $routeParams.conv_id], null, function (err, conv) {
            if (!err) {
                $scope.conv = conv;
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
                    $scope.conv.messs.push(mess);
                }
            });
        };

        $scope.delMess = function (index) {
            ApiServ("suppression du message", 'delete', ['messs', $scope.conv.messs[index]._id], null, function (err) {
                if (!err)
                    $scope.conv.messs.splice(index, 1);
            });
        };

        $scope.editButton = function (index) {
            mess = $scope.conv.messs[index];
            if (mess.editMode) {
                ApiServ("édition du message", 'put', ['messs', mess._id], {
                    content: mess.content,
                    conv: $scope.conv._id
                }, function (err, data) {
                    if (!err) {
                        mess.content = data.content;
                        mess.editDate = data.editDate;
                        mess.editMode = false;
                        mess.viewSource = false;
                    }
                });
            } else {
                mess.editMode = true;
                mess.viewSource = true;
            }
        };

        $scope.mine = function (mess) {
            return $scope.session.bureau || mess.login == $scope.session.login;
        };

    });
