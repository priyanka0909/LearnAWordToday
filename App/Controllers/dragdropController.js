var myApp = angular.module('myApp');
myApp.controller('dragdropController', ['$scope', '$rootScope', '$http', '$q', '$state', '$location', '$anchorScroll', '$stateParams', function ($scope, $rootScope, $http, $q, $state, $location, $anchorScroll, $stateParams) {

    $scope.$parent.hideWelcome = true;
    $scope.hideNoResultDiv = true;
    if (typeof ($stateParams.questions) == 'undefined' || $stateParams.questions == null || $stateParams.questions == '') {
        //var questions = ["someone is going in your direction", "you can only use this phrase", "This is a great way to show that you were paying ", "you should also check out the FluentU ",
        //    "you might not know what you want", "it’s a nice gesture to offer them a ride.", "If you have a moment, I would love your thoughts on this."];
        //$scope.hideNoResultDiv = false;

        if ($stateParams.questions == '') {
            alert('No Test found for the word currently.');
        }
        $state.go('Learn');
        return;
    }
    else {
        var questions = $stateParams.questions;
    }

    $scope.questions = questions;

    String.prototype.shuffle = function (questionNum) {
        //alert(this);
        var a = this.split(" ");
        var newArray = a.filter(function (v) { return v !== '' });
        var n = newArray.length;

        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = newArray[i];
            if (tmp != '' && tmp != ' ') {
                newArray[i] = newArray[j];
                newArray[j] = tmp;
            }
        }
        //alert(a.join(","));

        $("#dropWordsTopDiv").append("<br/><span>QNO:" + questionNum + "</span><div id='dropWordsBlankTopDiv" + questionNum + "' class='jdropwords'>");
        $("#dropWordsBlankTopDiv" + questionNum + "").append("<div id='dropWordsBlankDiv" + questionNum + "' class='blanks'>");
        $("#dropWordsBlankDiv" + questionNum + "").append("<p id='dropWordsBlankPara" + questionNum + "'>");
        $("#dropWordsBlankDiv" + questionNum).append("<ul id='dropWordsUL" + questionNum + "' class='words'>");

        for (var i = 0; i < newArray.length; i++) {
            $("#dropWordsBlankDiv" + questionNum + " #dropWordsBlankPara" + questionNum + "").append("<span class='blank' id='word-" + (i + 1) + "-" + questionNum + " placeholder='word1'></span>&nbsp;&nbsp;&nbsp;");
            $("#dropWordsUL" + questionNum).append("<li class='word' id='blank-" + (i + 1) + "-" + questionNum + "'>" + newArray[i] + "</li>");
        }
        $("#dropWordsBlankDiv" + questionNum + "").append("</p>");
        $("#dropWordsBlankTopDiv" + questionNum + "").append("</div>");
        $("#dropWordsTopDiv" + questionNum + "").append("</div><br/><br/>");

        return newArray.join(",");
    }

    $scope.init = function () {

        for (var x = 0; x < questions.length; x++) {
            questions[x].shuffle(x + 1);
        }

    }

    $scope.init();

    $(function () {
        $('.jdropwords').jDropWords({
            answers: "http://webserver.local/activities/jdropwords/answers.json"
        });
    });

    //alert(questions.shuffle());

    // $("#SubmitBT").click(function () {

    $scope.submit = function () {

        var result = '';
        for (var i = 0; i < questions.length; i++) {
            var sentence = $("#dropWordsBlankPara" + (i + 1) + " .sentence");
            var newSentense = '';
            for (var j = 0; j < sentence.length; j++) {
                newSentense += sentence[j].innerHTML;
            }
            if (questions[i].replace(/\s/g, '') == newSentense) {
                result += '<h5 class="correct">Question ' + (i + 1) + ' is correct</h5>';
            }
            else {
                result += '<h5 class="incorrect">Question ' + (i + 1) + ' is wrong</h5>';
            }
        }
        $rootScope.message = result;
        $('#messageModalDiv').modal('show');
    };


    $scope.reset = function () {
        $state.go('Dragdrop', { questions: questions }, { reload: true });
    };


    //$scope.getCheatSheet = function () {

    //    window.open("http://localhost:49981/App/shell.html#!/Cheatsheet?q=" + $scope.questions);
    //  //  $scope.questions;
    //}

}]);
