// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

        $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html'
        })

        // membres page that will use the MembreController
        .when('/membres', {
            templateUrl: 'views/membres.html',
            controller: 'MembreController'
        });

        $locationProvider.html5Mode(true);

    }
]);