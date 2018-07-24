/**
 * Created by Yuxin Wei on 4/18/2017.
 */

app.controller('ChatGroupCntl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $http.get(configs.serverUrl + '/groupchat/list').then(function (data) {

        $scope.groups = JSON.parse(JSON.stringify(data.data));
    });

    var userdata = $rootScope.username;
    var groupname = $rootScope.chatwithgroup;

    $scope.uploadingPicutre = false;
    $scope.upload = function (file) {
        //console.log(file);
        $http.post(configs.serverUrl + '/groupchat/message', {
            username: userdata,
            content: file,
            groupname: groupname,
            isPicture: true
        })
            .then(function successCallback(response, data) {
                    var data = {
                        username: userdata,
                        content: file,
                        groupname: groupname,
                        timestamp: new Date().toLocaleString(),
                        isPicture: true
                    }

                    //$scope.messages.push(data);
                    getMessages();
                    $scope.form.text = '';
                    socket.emit('sendGroupChat');
                },
                function errorCallback(response) {
                    console.log("Error in public chat-post");
                });

        $scope.uploadingPicutre = false;
    };

    $scope.startPicture = function () {
        $scope.uploadingPicutre = true;
    };

    $scope.stopPicture = function () {
        $scope.uploadingPicutre = false;
    };


    console.log("enter chatgroup cntl");
    if (!($rootScope.chatwithgroup === undefined))
        $http.get(configs.serverUrl + '/groupchat/message/' + $scope.chatwithgroup).then(function (data) {
            console.log(configs.serverUrl + '/groupchat/message/' + $scope.chatwithgroup);

            $scope.messages = JSON.parse(JSON.stringify(data.data));
        });

    $scope.chatWith = function (username) {
        $rootScope.chatwithgroup = username;
        console.log("enter " + $rootScope.chatwithgroup + " " + $rootScope.username);
        $http.post(configs.serverUrl + '/groupchat/enter', {
            groupname: $rootScope.chatwithgroup,
            username: $rootScope.username
        })
            .then(function (data) {
                $scope.messages = JSON.parse(JSON.stringify(data.data));
            });
    };

    $scope.sendstyle = {
        "text-align": "right"
    };
    $scope.receivestyle = {
        "text-align": "left"
    };


    var Username = $rootScope.username;
    $scope.username = Username;


    var getMessages = function () {
        $http.get(configs.serverUrl + '/groupchat/message/' + groupname)
            .then(function (data) {
                $scope.messages = JSON.parse(JSON.stringify(data.data));
                //console.log($scope.messages);
            });

    }
    getMessages();

    var socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket3");
        });
        $rootScope.socket = socket;
    } else {
        socket = $rootScope.socket;
    }

    socket.on('newGroupChat', function () {
        console.log("GET SOCKET");
        getMessages();
    });

    $scope.submitPost = function (username, message, location) {
        username = userdata;

        $http.post(configs.serverUrl + '/groupchat/message', {
            username: userdata,
            content: message,
            groupname: groupname,
            isPicture: false
        })
            .then(function successCallback(response, data) {
                    var data = {
                        username: username,
                        content: message,
                        groupname: groupname,
                        timestamp: new Date().toLocaleString(),
                        isPicture: false
                    }

                    $scope.messages.push(data);
                    $scope.form.text = '';
                    socket.emit('sendGroupChat');
                },
                function errorCallback(response) {
                    console.log("Error in public chat-submitpost");
                });
    }


    $scope.createGroup = function (groupNameInput, descriptionInput, user1Input, user2Input, user3Input) {

        var cur = $rootScope.username;
        console.log("enter create group " + user1Input + " " + user2Input);

        users = $rootScope.username;
        if (user1Input != undefined) {
            users = users + "," + user1Input;
        }
        if (user2Input != undefined) {
            users = users + "," + user2Input;
        }
        if (user3Input != undefined) {
            users = users + "," + user3Input;
        }
        console.log(users);
        $http.post(configs.serverUrl + '/groupchat', {
            groupname: groupNameInput,
            description: descriptionInput,
            users: users
        })
            .then(function successCallback(response) {
                    $scope.status = response.status;
                    console.log("response :" + response.status);
                    $rootScope.chatwithgroup = groupNameInput;
                    if ($scope.status == 200)
                        $location.url("/groupchat");
                },
                function errorCallback(response) {
                    console.log("Error in user signup");
                });

    };
    $scope.leave = function (groupnameInput, UserInput) {

        console.log("leave " + groupnameInput + " " + UserInput);
        $http.post(configs.serverUrl + '/groupchat/leave', {
            groupname: groupnameInput,
            username: UserInput
        })
            .then(function (data) {
                $scope.messages = JSON.parse(JSON.stringify(data.data));
            });
    }


    $scope.newmsg = function (username) {
        return false;
        for (var i = 0; i < $rootScope.newmessagefrom.length; i++) {
            if (username === $rootScope.newmessagefrom[i]) {
                return true;
            }
        }
        return false;
    }

    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser 1", data);
        getMessages();
    });

}]);
