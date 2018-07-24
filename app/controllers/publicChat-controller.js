app.controller("ChatCntl", ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.stopWords = ["since", "chat"];
    $scope.$watch('searchAnnounce', function () {
        console.log("stopWords" + "=" + $scope.searchAnnounce + "=" + $scope.stopWords.includes($scope.searchAnnounce));
        if ($scope.searchAnnounce === "" || $scope.searchAnnounce === null) {
            return $scope.numLimit = 1000;

        } else {
            return $scope.numLimit = 10;
        }

    });

    $scope.uploadingPublicPicutre = false;
    $scope.upload = function (file) {
        
        $http.post(configs.serverUrl + '/messages/public', {
            username: userdata,
            content: file,
            timestamp: new Date(),
            status: $scope.status,
            isPicture: true
        }).then(function successCallback(response, data) {


                $scope.form.text = '';
                socket.emit('sendPublicChat');

                getMessages();
            },
            function errorCallback(response) {
                console.log("error in public chat send picture message");
            });
        /*$scope.messages.push({
            username: userdata,
            content: file,
            timestamp: new Date(),
            status: $scope.status,
            isPicture: true
        });*/
        $scope.uploadingPublicPicutre = false;
    };

    $scope.startPublicPicture = function () {
        $scope.uploadingPublicPicutre = true;
    };
    $scope.stopPublicPicture = function () {
        $scope.uploadingPublicPicutre = false;
    };
    var userdata = $rootScope.username;

    var getMessages = function () {
        $http.get(configs.serverUrl + '/messages/public')
            .then(function (data) {
                $scope.messages = JSON.parse(JSON.stringify(data.data));
            });
        $http.get(configs.serverUrl + '/users/' + userdata + '/status')
            .then(function (data) {
                $scope.status = JSON.parse(JSON.stringify(data.data));
            })
    };
    getMessages();

    var socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket6");
        });
        $rootScope.socket = socket;
    } else {
        socket = $rootScope.socket;
    }

    socket.on('newPublicChat', function () {
        getMessages();
    });

    $scope.submitPost = function (username, message, location, input_status) {
        username = userdata;
        $http.post(configs.serverUrl + '/messages/public', {
            username: userdata,
            content: message,
            status: input_status,
            isPicture: false
        })
            .then(function successCallback(response, data) {

                    $scope.form.text = '';
                    socket.emit('sendPublicChat');
                    getMessages();
                },
                function errorCallback(response) {
                    console.log("Error in public chat");
                });

    }

    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser 1", data);
        getMessages();
    });

}]);
