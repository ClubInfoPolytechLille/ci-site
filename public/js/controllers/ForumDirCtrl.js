angular.module('ForumDirCtrl', ['SessionsServ', 'ApiServ'])
    .controller('ForumDirCtrl', function ($scope, $routeParams, SessionServ, ApiServ) {
        $scope.convs = [];
        $scope.dosss = [];
        $scope.formDoss = {};
        $scope.formConv = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });

        ApiServ("récupération du dossier", 'get', 'dosss', $routeParams.doss_id, function (err, doss) {
            if (err) {
                console.error(err);
            } else {
                if (doss) {
                    $scope.doss = doss;
                    $scope.dosss = doss.dosss;
                    $scope.convs = doss.convs;
                }
            }
        });

        // Dossiers
        $scope.addDoss = function () {
            console.log('CALLA');
            $scope.formDoss.parent = $routeParams.doss_id;
            ApiServ("création du dossier", 'post', 'dosss', $scope.formDoss, function (err, doss) {
                if (!err) {
                    $scope.formDoss = {};
                    $scope.dosss.push(doss);
                }
            });
        };

        $scope.delDoss = function (index) {
            ApiServ("suppression du dossier", 'delete', 'dosss', $scope.dosss[index]._id, function (err) {
                if (!err)
                    $scope.dosss.splice(index, 1);
            });
        };

        // Conversations
        $scope.addConv = function () {
            $scope.formConv.parent = $routeParams.doss_id;
            ApiServ("création de la conversation", 'post', 'convs', $scope.formConv, function (err, conv) {
                if (!err) {
                    $scope.formConv = {};
                    $scope.convs.push(conv);
                }
            });
        };

        $scope.delConv = function (index) {
            ApiServ("suppression de la conversation", 'delete', 'convs', $scope.convs[index]._id, function (err) {
                if (!err)
                    $scope.convs.splice(index, 1);
            });
        };

    });
