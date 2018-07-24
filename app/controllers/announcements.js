app.controller("AnnouncementCntl", ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    $scope.$watch('searchAnnounce', function () {
        $scope.searchAnnounce_NoStop = $scope.searchAnnounce;
        if (stopWords.includes($scope.searchAnnounce)) {
            searchAnnounceArray = $scope.searchAnnounce.split(" ");
            for (let i = 0; i <= stopWords.length; i++) {

                stopWordIndex = searchAnnounceArray.indexOf(stopWords[i]);
                searchAnnounce_NoStopArray = searchAnnounceArray.splice(stopWordIndex);
                $scope.searchAnnounce_NoStop = searchAnnounce_NoStopArray.toString();
            }
        }
        if ($scope.searchAnnounce_NoStop === "" || $scope.searchAnnounce_NoStop === null) {
            return $scope.numLimit = 1000;

        } else {
            return $scope.numLimit = 10;
        }
    });

    let userdata = $rootScope.username;
    $scope.mydata = $rootScope.mydata;

    let getMessages = function () {
        $http.get(configs.serverUrl + '/messages/announcements')
            .then(function (data) {
                $scope.announcements = JSON.parse(JSON.stringify(data.data));
            });

    };
    getMessages();

    $scope.uploadingPicutre = false;
    $scope.upload = function (file) {

        $http.post(configs.serverUrl + '/messages/announcements', {
            username: userdata,
            content: file,
            timestamp: new Date(),
            isPicture: true
        }).then(function successCallback(response, data) {


                $scope.form.text = '';
                socket.emit('sendAnnouncement');
            },
            function errorCallback(response) {
                console.log("error in announcement");
            });
        $scope.announcements.push({
            username: userdata,
            content: file,
            timestamp: new Date(),
            isPicture: true
        });
        getMessages();
        $scope.uploadingPicutre = false;
    };

    $scope.startPicture = function () {
        $scope.uploadingPicutre = true;
    };

    $scope.stopPicture = function () {
        $scope.uploadingPicutre = false;
    };

    let socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket");
        });
        $rootScope.socket = socket;
    } else {
        socket = $rootScope.socket;
    }

    socket.on('newAnnouncement', function () {
        getMessages();
    });
    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser3", data);

        getMessages();
    });

    $scope.submitPost = function (username, message, location) {
        username = userdata;
        $http.post(configs.serverUrl + '/messages/announcements', {
            username: userdata,
            content: message,
            isPicture: false
        })
            .then(function successCallback(response) {

                    $scope.form.text = '';
                    socket.emit('sendAnnouncement');
                },
                function errorCallback(response) {
                    console.log("Error in post announcement");
                });
        $scope.announcements.unshift({
            username: userdata,
            content: message,
            isPicture: false
        });

    }
}]);
