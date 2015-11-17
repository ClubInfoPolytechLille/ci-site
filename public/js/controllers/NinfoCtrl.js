angular.module('NinfoCtrl', ['nl2br', 'SessionsServ', 'ApiServ', 'NotifyServ'])
    .controller('NinfoCtrl', function ($scope, SessionServ, ApiServ, NotifyServ) {
        $scope.ninfo = {}
        $scope.saving = false;

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
            actualiser();
        });
        actualiser();

        function actualiser() {
            if ($scope.session) {
                ApiServ("récupération des préférence Nuit de l'Info", 'get', 'profile/ninfo', null, function (err, ninfo) {
                    if (!err)
                        $scope.ninfo = ninfo;
                });
                ApiServ("récupération de la liste des participants à Nuit de l'Info", 'get', 'ninfo', null, function (err, equipes) {
                    if (!err)
                        $scope.equipes = equipes;
                });
            }
        }

        $scope.save = function () {
            var not = NotifyServ.promise("Sauvegarde...");
            $scope.saving = true;
            ApiServ("sauvegarde des préférences Nuit de l'Info", 'put', 'profile/ninfo', $scope.ninfo, function (err, membre) {
                if (!err) {
                    actualiser();
                    not.success("Sauvegardé !");
                }
                $scope.saving = false;
            });
        };
    });
