// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html'
            })
            .when('/membres', {
                templateUrl: 'views/membres.html',
                controller: 'MembreController'
            })
            .when('/connect', {
                templateUrl: 'views/connect.html',
                controller: 'ConnectController'
            });

        $locationProvider.html5Mode(true);

    }
]);