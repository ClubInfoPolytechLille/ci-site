angular.module('NinfoCtrl', ['SessionsServ', 'ApiServ', 'NotifyServ'])
    .controller('NinfoCtrl', function ($scope, SessionServ, ApiServ, NotifyServ) {
        $scope.ninfo = {}
        $scope.saving = false;

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });

        if ($scope.session) {
            ApiServ("récupération des préférence Nuit de l'Info", 'get', 'profile/ninfo', null, function (err, ninfo) {
                if (!err)
                    $scope.ninfo = ninfo;
            });
        }

        $scope.save = function () {
            var not = NotifyServ.promise("Sauvegarde...");
            $scope.saving = true;
            ApiServ("sauvegarde des préférences Nuit de l'Info", 'put', 'profile/ninfo', $scope.ninfo, function (err, membre) {
                if (!err)
                    not.success("Sauvegardé !");
                $scope.saving = false;
            });
        };
    });