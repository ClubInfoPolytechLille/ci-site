angular.module('MembreCtrl', ['SessionsServ', 'ApiServ', 'ui.sortable'])
    .controller('MembreCtrl', function ($scope, SessionServ, ApiServ) {
        $scope.membres = [];
        $scope.formData = {};

        $scope.session = SessionServ.cur;
        SessionServ.onChange(function () {
            $scope.session = SessionServ.cur;
        });

        ApiServ("récupération de la liste des membres", 'get', 'membres', null, function (err, membres) {
            if (!err)
                $scope.membres = membres;
        });

        // $scope.dragControlListeners = {
        //     orderChanged: function (e) {
        //         console.log('Swap', e.source.index, e.dest.index);
        //     }
        // };

        $scope.createMembre = function () {
            ApiServ("création du membre", 'post', 'membres', $scope.formData, function (err, membre) {
                if (!err) {
                    $scope.formData = {};
                    $scope.membres.push(membre);
                }
            });
        };

        $scope.deleteMembre = function (index) {
            ApiServ("création du membre", 'delete', ['membres', $scope.membres[index]._id], null, function (err, data) {
                if (!err) {
                    $scope.membres.splice(index, 1);
                }
            });
        };
    });
