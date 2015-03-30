angular.module('ConnectCtrl', []).controller('ConnectController', ['$scope', 'SessionService', 'EncryptService',
  function ($scope, SessionService, EncryptService) {
    EncryptService.preload(function () {
      return undefined;
    });
    $scope.connect = {
      connect: function () {
        SessionService.connect($scope.connect.login, $scope.connect.pass);
      }
    };
  }
]);
