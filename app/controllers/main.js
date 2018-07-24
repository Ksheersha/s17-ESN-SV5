var app = angular.module("myApp", ["ngRoute", 'ngFileUpload', 'ngImgCrop']);
stopWords = ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your"];

var search = function ($scope) {
    $scope.searchAnnounce_NoStop = $scope.searchAnnounce;
    if (stopWords.includes($scope.searchAnnounce)) {
        searchAnnounceArray = $scope.searchAnnounce.split(" ");
        for (var i = 0; i <= stopWords.length; i++) {

            stopWordIndex = searchAnnounceArray.indexOf(stopWords[i]);
            searchAnnounce_NoStopArray = searchAnnounceArray.splice(stopWordIndex);
            $scope.searchAnnounce_NoStop = searchAnnounce_NoStopArray.toString();
        }
    }
    if ($scope.searchAnnounce_NoStop == "" || $scope.searchAnnounce_NoStop == null) {
        return $scope.numLimit = 1000;

    } else {
        return $scope.numLimit = 10;
    }
}

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/Signin.html"
        })
        .when("/statuslegend", {
            templateUrl: "views/statusLegend.html"
        })

        .when('/publicChat', {

            templateUrl: "views/publicChat.html"
        })
        .when('/directory', {

            templateUrl: "views/directory.html"
        })
        .when('/privateChat', {

            templateUrl: "views/privateChat.html"
        })

        .when('/provideFindHelp', {
            templateUrl: "views/provideFindHelp.html"
        })

        .when('/registerProvider', {

            templateUrl: "views/registerProvider.html"
        })

        .when('/selectgroup', {

            templateUrl: "views/GroupSelect.html"
        })
        .when('/announcements', {

            templateUrl: "views/announcements.html"
        })
        .when('/groupchat', {

            templateUrl: "views/GroupChat.html"
        })
        .when('/groupcreate', {

            templateUrl: "views/GroupCreate.html"
        })

        .when('/volunteer', {

            templateUrl: "views/volunteer.html"

        })

        .when('/volunteer-thankyou', {
            templateUrl: "views/volunteer-thankyou.html"
        })

});
