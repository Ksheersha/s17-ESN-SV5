/**
 * Created by nandh on 2/28/2017.
 */
app.controller('DirectoryCntl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    var getUsers = function() {
        $http.get(configs.serverUrl + '/users').then(function (data) {
            $scope.users = JSON.parse(JSON.stringify(data.data));
        });
    };

    getUsers();

    $scope.chatWith = function (username) {
        $rootScope.chatwith = username;
    };

    $scope.mydata = $rootScope.mydata;
    var socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket-directory");
        });
        $rootScope.socket = socket;
    } else {
        socket = $rootScope.socket;
    }

    socket.on('newMessage', function (data) {
        if ($rootScope.username === data.to) {
            $scope.tousername = data.from;
        }
    });



    $scope.newmsg = function (username) {
        for (var i = 0; i < $rootScope.newmessagefrom.length; i++) {
            if (username === $rootScope.newmessagefrom[i]) {
                return true;
            }
        }
        return false;
    };

    $scope.startAdminister = function (user) {
        $scope.usernameAlert = "";
        $scope.passwordAlert = "";
        $scope.administering = true;
        $scope.userBeingAdministered = user;
        $scope.previousUsername = user.username;
    };

    $scope.finishAdminister = function () {
        $scope.usernameAlert = "";
        $scope.passwordAlert = "";
        if ($scope.userBeingAdministered.username.length < 3 || configs.stopwords.indexOf($scope.userBeingAdministered.username) > -1) {
            $scope.usernameAlert = "Invalid username";
            return;
        }
        if ($scope.userBeingAdministered.password.length < 4) {
            $scope.passwordAlert = "Invalid password";
            return;
        }
        $http.put(configs.serverUrl + '/users/' + $scope.previousUsername, JSON.stringify($scope.userBeingAdministered))
            .then(function successCallback(response, data) {

            });
        if ($scope.userBeingAdministered.account_status == "Inactive") {
            socket.emit('deactivate', $scope.userBeingAdministered.username);
            console.log("emit deactivate");
        }
        $scope.administering = false;

    }

    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser 4", data);
        //getUsers();
    });


}]);
