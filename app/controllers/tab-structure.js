angular.module("myApp", ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {

                templateUrl: '../views/Signin.html'
            })
            .when('/directory', {

                templateUrl: '../views/directory.html',
                // controller: 'DirectoryCntl'
            })
            .when('/publicChat', {
                templateUrl: '../views/publicChat.html',
                // controller: 'chatCtrl'
            })
            .when('/announcements', {
                templateUrl: '../views/announcements.html',
                // controller: 'chatCtrl'
            })
            .when('/selectgroup', {
                templateUrl: "../views/groupselect.html",
                // controller: 'chatCtrl'
            })
            // .when('/groupchat', {
            //
            //     templateUrl: "../views/groupchat.html",
            //     // controller: 'chatCtrl'
            // })
            // .when('/groupcreate', {
            //
            //     templateUrl: "../views/groupcreate.html",
            //     // controller: 'chatCtrl'
            // })
            .when('/volunteer', {

                templateUrl: '../views/volunteer.html',

            })
            .otherwise({redirectTo: '/'});
    }]);
