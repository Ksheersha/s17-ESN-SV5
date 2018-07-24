/**
 * Created by sheersha on 4/18/17.
 */
app.controller('volnCntl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $scope.userName = "";
    $http.get(configs.serverUrl + '/users/')

        .then(function (data) {
            console.log("$rootScope.username:" + $rootScope.username);
            console.log("in get choice 1 ");
            $scope.choices = JSON.parse(JSON.stringify(data.data));

        });

    $scope.submitPost = function (username, choice) {
        //alert("Thankyou!");
        // username = userdata;
        $http.post(configs.serverUrl + '/users/' + username + '/choice/' + choice)
            .then(function successCallback(response, data) {
                    $scope.choice = response.status;
                    console.log(" $scope.choice: " + response.status);
                    if ($scope.choice === 201) {
                        console.log("inside if");
                        $location.url("/volunteer-thankyou");

                    }


                },
                function errorCallback(response) {
                    console.log("Error in post choice");
                });
        $http.get(configs.serverUrl + '/users/')

            .then(function (data) {
                console.log("inside get choice 2");
                $scope.choices = JSON.parse(JSON.stringify(data.data));

            });

    }

    $scope.chatWith = function (username) {
        $rootScope.chatwith = username;
    };

    var socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket7");
        });
        $rootScope.socket = socket;
    } else {
        socket = $rootScope.socket;
    }


    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser 10", data);
        if (data === $rootScope.mydata.username) {
            $location.url("/");
        }
    });
}]);
