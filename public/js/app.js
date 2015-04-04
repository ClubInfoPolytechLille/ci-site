angular.module('ciApp', ['ngAnimate', 'ngRoute', 'SessionsCtrl', 'ConnectCtrl', 'MembreCtrl']).config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html'
            })
            .when('/membres', {
                templateUrl: 'views/membres.html',
                controller: 'MembreCtrl'
            })
            .when('/connect', {
                templateUrl: 'views/connect.html',
                controller: 'ConnectCtrl'
            });

        $locationProvider.html5Mode(true);

    }
]);
