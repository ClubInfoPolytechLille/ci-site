angular.module('ciApp', ['ngAnimate', 'ngRoute', 'ConnectCtrl', 'MembreCtrl', 'NinfoCtrl', 'ForumDirCtrl', 'ForumConvCtrl', 'SessionsCtrl', 'ProfileCtrl']).config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html'
        })
        .when('/membres', {
            templateUrl: 'views/membres.html',
            controller: 'MembreCtrl'
        })
        .when('/forum', {
            redirectTo: 'forum/dir/root'
        })
        .when('/ninfo', {
            templateUrl: 'views/ninfo.html',
            controller: 'NinfoCtrl'
        })
        .when('/trosh', {
            templateUrl: 'views/trosh.html'
        })
        .when('/forum/dir/:doss_id', {
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
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});
