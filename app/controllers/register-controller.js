/**
 * Created by nandh on 2/22/2017.
 */

app.controller("RegisterCtrl", ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

    $scope.directMain = function (usernameInput, passwordInput) {
        $rootScope.username = usernameInput;
        $http.post(configs.serverUrl + '/users/login', {
            username: usernameInput,
            password: passwordInput
        })
            .then(function successCallback(response) {
                    $scope.status = response.status;

                    if ($scope.status === 200) {
                        $location.url("/statuslegend");
                        $http.get(configs.serverUrl + '/users/' + usernameInput).then(function successCallback2(response) {
                            $rootScope.mydata = response.data[0];
                            console.log("global user ", $rootScope.mydata);

                        });
                    }

                },
                function errorCallback(response) {
                    $scope.status = response.status;
                    console.log("Error in Log in with status:" + response.status);
                });


    };
    $scope.directRegister = function (usernameInput, passwordInput) {
        $rootScope.username = usernameInput;

        $http.post(configs.serverUrl + '/users', {
            username: usernameInput,
            password: passwordInput
        })
            .then(function successCallback(response) {
                    $scope.status = response.status;
                    $scope.event = "signup";
                    if ($scope.status == 201)
                        $location.url("/statuslegend");
                },
                function errorCallback(response) {
                    console.log("Error in user signup");
                });

    };
    $scope.clear = function () {

        $scope.password = '';
        $scope.username = '';
        $scope.email = '';
    };

}]);
