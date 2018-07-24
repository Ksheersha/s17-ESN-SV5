app.controller('helpCntl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.success = "";
    $scope.name = "";
    $scope.address = "";
    $scope.comments = "";
    $scope.helpSelected = "";

    $scope.helpOptions = ["Physician/Medicine", "Blankets/Clothes", "Food", "Shelter", "Multi-purpose tools", "Others"];

    $scope.clear = function () {
        $scope.name = "";
        $scope.address = "";
        $scope.comments = "";
        $scope.helpSelected = "";
        $scope.success = "";
    }

    $scope.getHelpProviders = function () {
        $http.get(configs.serverUrl + '/providers/gethelp')
            .then(function (data) {
                console.log("retrieve all data");
                $scope.helpProviders = JSON.parse(JSON.stringify(data.data));
            });
    }

    $scope.saveHelp = function (name, address, helpOptions, comments) {

        $http.post(configs.serverUrl + '/providers/registerhelp', {
            username: name,
            Address: address,
            HelpType: helpOptions,
            Comments: comments
        })
            .then(function successCallback(response, data) {
                    /*  var data = {
                     username: name,
                     Address: address,
                     HelpType: helpOptions,
                     Comments:comments
                     }*/
                    //    $scope.$watch('success', function() {
                    $scope.success = 'true';
                    console.log("Help provider registered");
    

                },
                function errorCallback(response) {


                    $scope.success = 'false';
                    console.log("Error in register help provider");
         

                });
    }
    var socket = undefined;
    if ($rootScope.socket === undefined) {
        socket = io.connect(configs.serverUrl, function () {
            console.log("connect to socket1");
        });
        $rootScope.socket = socket;
    } else {
        socket = $rootScope.socket;
    }
    socket.on('deactivateUser', function (data) {
        console.log("receive deactivateUser 5", data);
        $scope.getHelpProviders();
    });


}]);
