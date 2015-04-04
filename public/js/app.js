angular.module('ciApp', ['ngAnimate', 'ngRoute', 'ConnectCtrl', 'MembreCtrl', 'ForumDirCtrl', 'SessionsCtrl']).config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html'
            })
            .when('/membres', {
                templateUrl: 'views/membres.html',
                controller: 'MembreCtrl'
            })
            .when('/forum', {
                templateUrl: 'views/forumDir.html',
                controller: 'ForumDirCtrl'
            })
            .when('/connect', {
                templateUrl: 'views/connect.html',
                controller: 'ConnectCtrl'
            });

        $locationProvider.html5Mode(true);

    }
]);
