angular.module('ciApp', ['ngAnimate', 'ngRoute', 'ConnectCtrl', 'MembreCtrl', 'ForumDirCtrl', 'ForumConvCtrl', 'SessionsCtrl']).config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html'
        })
        .when('/membres', {
            templateUrl: 'views/membres.html',
            controller: 'MembreCtrl'
        })
        .when('/forum', {
            redirectTo: 'forum/dir/0'
        })
        .when('/forum/dir/:dir_id', {
            templateUrl: 'views/forumDir.html',
            controller: 'ForumDirCtrl'
        })
        .when('/forum/conv/:conv_id', {
            templateUrl: 'views/forumConv.html',
            controller: 'ForumConvCtrl'
        })
        .when('/connect', {
            templateUrl: 'views/connect.html',
            controller: 'ConnectCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});
