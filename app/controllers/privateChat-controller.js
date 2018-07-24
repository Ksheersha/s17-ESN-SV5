app.controller("privateChatCntl", ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    var fromUsername = $rootScope.username;
    var toUsername = $rootScope.chatwith;

    var getMessages = function () {
        $http.get(configs.serverUrl + '/messages/private/' + fromUsername + '/' + toUsername)
            .then(function (data) {
                $scope.messages = JSON.parse(JSON.stringify(data.data));
          
            });
    };
    getMessages();

    $scope.uploadingPicutre = false;
    $scope.upload = function (file) {
        //console.log(file);
        $http.post(configs.serverUrl + '/messages/private', {
            sendingUserName: fromUsername,
            receivingUserName: toUsername,
            content: file,
            timestamp: new Date(),
            status: $scope.status,
            isPicture: true
        }).then(function successCallback(response, data) {

                $scope.form.text = '';
                socket.emit('sendMessage', {
                    from: fromUsername,
                    to: toUsername
                });
                getMessages();

            },
            function errorCallback(response) {
                console.log("error in private chat- send message");
            });
        /*$scope.messages.push({
            sendingUserName: fromUsername,
            receivingUserName: toUsername,
            content: file,
            timestamp: new Date(),
            status: $scope.status,
            isPicture: true
        });*/
        $scope.uploadingPicutre = false;
    };

    
    $scope.startPicture = function () {
        $scope.uploadingPicutre = true;
    };
    $scope.stopPicture = function () {
        $scope.uploadingPicutre = false;
    };
    $scope.$watch('searchAnnounce', function () {
        if ($scope.searchAnnounce === "" || $scope.searchAnnounce === null) {
            return $scope.numLimit = 1000;

        } else {
            return $scope.numLimit = 10;
        }

    });

    $scope.sendingUserName = fromUsername;
    $scope.receivingUserName = toUsername;
    $scope.sendstyle = {
        "text-align": "right"
    };
    $scope.receivestyle = {
        "text-align": "left"
    };

    for (var i = 0; i < $rootScope.newmessagefrom.length; i++) {
        if (toUsername === $rootScope.newmessagefrom[i]) {
            $rootScope.newmessagefrom.splice(i, 1);
        }
    }

    $http.get(configs.serverUrl + '/users/' + fromUsername + '/status')
        .then(function (data) {
            $scope.status = data.data[0].status;

        });

    if (toUsername !== undefined) {
        $scope.chattitle = "Chat messages with " + toUsername;
    } else {
        $scope.chattitle = "Please choose a user in the directory";
    }

    var socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket5");
        });
        $rootScope.socket = socket;
    } else {
        socket = $rootScope.socket;
    }
    socket.emit('setUsername', fromUsername);


    socket.on('newMessage', function (data) {
        if (fromUsername === data.to) {
            getMessages();
        }
    });

    $scope.submitPost = function (message, location) {
        if (fromUsername === undefined || toUsername === undefined) {
            return;
        }
        $http.post(configs.serverUrl + '/messages/private', {
            sendingUserName: fromUsername,
            receivingUserName: toUsername,
            content: message,
            timestamp: new Date(),
            status: $scope.status,
            isPicture: false
        })
            .then(function successCallback(response, data) {

                    /*var data = {
                     sendingUserName: fromUsername,
                     content: message,
                     timestamp: new Date(),
                     status: $scope.status
                     }
                     $scope.messages.push(data);*/
                    getMessages();
                    $scope.form.text = '';
                    socket.emit('sendMessage', {
                        from: fromUsername,
                        to: toUsername
                    });

                },
                function errorCallback(response) {
                    console.log("error in private chat submit post");
                });
    }

    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser privatechat", data);
        getMessages();
    });

}]);
