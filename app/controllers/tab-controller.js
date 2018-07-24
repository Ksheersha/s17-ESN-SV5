/**
 * Created by nandh on 2/24/2017.
 */

app.controller("tabCntl", ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

    //console.log("in tabcntl SK");
    $scope.logout = function () {
        $scope.userName = $rootScope.username;
        var userdata = $rootScope.username;
        console.log("in logout" + userdata);


        $http.post(configs.serverUrl + '/users/logout', {username: userdata})
            .then(function successCallback(response) {
                    $location.url("/");
                    console.log("log out");
                },
                function errorCallback(response) {
                    console.log("error in log out");
                });
    };
    var socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket-tab controller");


        });
        $rootScope.socket = socket;
    }
    else {
        socket = $rootScope.socket;
    }
    if ($rootScope.newmessagefrom === undefined) {
        $rootScope.newmessagefrom = [];
    }
    socket.on('newMessage', function (data) {
        console.log("receive mewMessage in tab");
        if ($rootScope.username === data.to) {
            $scope.newlabel = "(new)";
            for (var i = 0; i < $rootScope.newmessagefrom.length; i++) {
                if (data.from === $rootScope.newmessagefrom[i]) {
                    return;
                }
            }
            $rootScope.newmessagefrom.push(data.from);
        }
    });

    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser tab controller", data);
        if (data === $rootScope.mydata.username) {
            $location.url("/");
        }
    });


}]);
