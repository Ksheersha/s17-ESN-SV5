/**
 * Created by nandh on 2/22/2017.
 */

app.controller("statusCntl", ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    $scope.userName = "";

    var getStatus = function() {
        $http.get(configs.serverUrl + '/users/' + $rootScope.username + '/status')

            .then(function (data) {

                $scope.status = JSON.parse(JSON.stringify(data.data));
            });
        $scope.init = function () {
            var userdata = $rootScope.username;
            $scope.userName = $rootScope.username;

            $scope.newStatus = function (status) {


                $http.post(configs.serverUrl + '/users/' + userdata + '/status/' + status)
                    .then(function successCallback(response) {
                            $scope.status = response.status;

                        },
                        function errorCallback(response) {
                            console.log("Error in post status");
                        });
                $http.get(configs.serverUrl + '/users/' + userdata + '/status')

                    .then(function (data) {

                        $scope.status = JSON.parse(JSON.stringify(data.data));

                    });
            }

        }
    };
    getStatus();

    var socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket2");
        });
        $rootScope.socket = socket;
    } else {
        socket = $rootScope.socket;
    }
    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser 2", data);
        getStatus();
    });

}]);
