//var myApp = angular.module('myApp', ['ui.router', 'ngCookies', 'ngSanitize', 'ui.bootstrap.pagination']);  //
var myApp = angular.module('myApp');
myApp.controller('mainController', ['$scope', '$http', '$q', '$state', '$location', '$anchorScroll', '$stateParams', 'learnService', '$sce', function ($scope, $http, $q, $state, $location, $anchorScroll, $stateParams, learnService, $sce) {

    $scope.$parent.hideWelcome = true;
    $scope.dataloaded = true;
    $scope.showExamples = false;
    $scope.showMeanings = false;
    $scope.noData = false;
    $scope.showGrammarTest = false;
    $scope.output = "";
    $scope.topic = "";
    $scope.gtFetchInProgress = false;
    $scope.recordingStarted = false;
    $scope.recordingStopped = true;
    $scope.langoptions = "en-US";
    $scope.examplesToDisplay = [];
    $scope.hideNoUsageFound = true;
    $scope.items = ['a', 'an', 'the']; //default

    $scope.getGrammarTypeLists = function () {

        if (typeof ($stateParams.type) == 'undefined' || $stateParams.type == null || $stateParams.type == '') {
            $scope.grammarType = 'Articles';
        }
        else {
            $scope.grammarType = $stateParams.type;
        }

        learnService.getGrammarTypeLists($scope.grammarType).then(function (response) {
            $scope.typeLists = response.data;
            if (typeof ($scope.typeLists) != 'undefined' && $scope.typeLists != null && $scope.typeLists != '' && $scope.typeLists.indexOf(',') != -1) {
                $scope.items = $scope.typeLists.split(',');
            }
        });

    }

    $scope.getGrammarTypeLists();
    $scope.numPerPage = 5;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;



    $scope.setPage = function () {
        if ($scope.questions != undefined)
            $scope.data = fetchData(($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage);
    };

    $scope.$watch('currentPage', $scope.setPage);

    $scope.client = null;

    function fetchData(offset, limit) {
        return $scope.questions.slice(offset, offset + limit);
    }


    function getKey() {
        return document.getElementById("key").value;
    }

    function getLanguage() {
        return languageoptions.value;
    }

    function setText(text) {
        $scope.showExamples = false;
        document.getElementById("output").value += text + "\n";
        $scope.output = text.replace('.', '');
    }

    $scope.start = function () {
        $scope.recordingStarted = true;
        $scope.recordingStopped = false;
        $scope.client.startMicAndContinuousRecognition();
    }

    $scope.stop = function () {
        $scope.recordingStopped = true;
        $scope.recordingStarted = false;
        $scope.client.endMicAndContinuousRecognition();
    }

    $scope.fetchMeanings = function () {

        if ($scope.output == undefined || $scope.output == null || $scope.output == "") {
            alert("Please enter a Word to search & try again.");
            return;
        }
        $scope.showMeanings = false;
        $scope.showExamples = false;
        $scope.dataloaded = false;
        $scope.noData = false;
        $scope.Meanings = [];
        learnService.getMeanings($scope.output.replace(/\./g, '')).then(function (response) {
            $scope.dataloaded = true;
            $scope.Meanings = (response !== null && response.data !== null && response.data.length > 0) ? response.data : [];
            if ($scope.Meanings.length > 0) { $scope.showMeanings = true; $scope.dataloaded = true; }
            else
            { $scope.noData = true; $scope.dataloaded = true; }
        })

    }

    $scope.fetchExamples = function () {

        if ($scope.output == undefined || $scope.output == null || $scope.output == "") {
            alert("Please enter a Word to search & try again.");
            return;
        }

        $scope.dataloaded = false;
        $scope.showMeanings = false;
        $scope.showExamples = false;
        $scope.noData = false;
        $scope.examplesToDisplay = [];
        learnService.getExamples($scope.output.replace(/\./g, '')).then(function (response) {

            if (response !== null && response.data !== null && response.data.length > 0) {
                $scope.dataloaded = true;
                $scope.examples = response.data;
                if (typeof ($scope.examples) != 'undefined' && $scope.examples != null & $scope.examples.length > 0) {

                    if ($scope.examples.length < 3) {
                        $scope.examplesToDisplay = $scope.examples.slice();
                    }
                    else {
                        for (var i = 0; i < 3; i++) {
                            $scope.examplesToDisplay.push($scope.examples[i]);
                        }
                    }
                    $scope.showExamples = true;
                }
                else {
                    $scope.dataloaded = true;
                    $scope.noData = true;
                }
            }
            else {
                $scope.dataloaded = true;
                $scope.noData = true;
            }

        });

    }

    $scope.goToJumbledTest = function () {

        if ($scope.output == undefined || $scope.output == null || $scope.output == "") {
            alert("Please enter a Word to search & try again.");
            return;
        }

        $scope.dataloaded = false;
        $scope.showExamples = false;
        $scope.showMeanings = false;
        $scope.noData = false;

        learnService.getExamples($scope.output.replace(/\./g, '')).then(function (response) {

            if (response !== null && response.data !== null && response.data.length > 0) {
                $scope.dataloaded = true;
                $scope.sentences = response.data.slice();
                var questions = $scope.sentences.sort(function (arg1, arg2) { return arg1.length - arg2.length });  // [];
                //for (i = 0; i < $scope.sentences.length; i++) {
                //    var noOfWords = $scope.sentences[i].split(' ');
                //    if (noOfWords.length < 20) {
                //        questions.push($scope.sentences[i]);
                //    }
                //}
                $state.go('Dragdrop', { questions: questions });
            }
            else {
                $scope.dataloaded = true;
                $scope.noData = true;
            }

        });
    }


    $scope.createAndSetupClient = function () {
        var client;
        var languageoptions = document.getElementById("languageoptions");
        var speechActivity = document.getElementById("speechActivity");
        var networkActivity = document.getElementById("networkActivity");

        document.getElementById("startBtn").disabled = false;

        if ($scope.client) {
            stop();
        }

        $scope.client = new BingSpeech.RecognitionClient(getKey(), getLanguage());

        $scope.client.onFinalResponseReceived = function (response) {
            setText(response);
        }

        $scope.client.onError = function (code, requestId) {
            console.log("<Error with request n°" + requestId + ">");
        }

        $scope.client.onVoiceDetected = function () {
            speechActivity.classList.remove("hidden");
        }

        $scope.client.onVoiceEnded = function () {
            speechActivity.classList.add("hidden");
        }

        $scope.client.onNetworkActivityStarted = function () {
            networkActivity.classList.remove("hidden");
        }

        $scope.client.onNetworkActivityEnded = function () {
            networkActivity.classList.add("hidden");
        }
    }

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    function replaceAt(string, index, replace) {
        return string.substring(0, index) + replace + string.substring(index + 1);
    }

    //checks if there are any articles/prepositions/conjunctions etc, only then adds to scope variable to bind to html.
    function checker(value) {
        var count = 0;
        for (var i = 0; i < $scope.items.length; i++) {
            if (value.indexOf(' ' + $scope.items[i] + ' ') != -1) {
                count++;
                break;
            }
        }
        return (count > 0)
    }

    $scope.fetchGrammarTest = function () {
        $scope.hideNoUsageFound = true;
        if ($scope.topic == undefined || $scope.topic == null || $scope.topic == "") {
            alert("Please enter a Topic Name & try again.");
            return;
        }
        $scope.gtFetchInProgress = true;
        $scope.dataloaded = false;

        learnService.getExamples($scope.topic.replace(/\./g, '')).then(function (response) {

            if (response !== null && response.data !== null && response.data.length > 0) {
                $scope.dataloaded = true;
                $scope.showGrammarTest = true;
                $scope.grammarTestExamples = (response.data != null && typeof (response.data) != 'undefined' && response.data.length > 0) ? response.data.filter(checker) : [];
                if (typeof ($scope.grammarTestExamples) == 'undefined' || $scope.grammarTestExamples == null || $scope.grammarTestExamples.length == 0) {
                    $scope.gtFetchInProgress = false;
                    $scope.hideNoUsageFound = false;
                    $scope.showGrammarTest = false;
                    $scope.dataloaded = true;
                }

                $scope.questions = []; //
                $scope.showGrammarTest = true;

                for (var i = 0; i < $scope.grammarTestExamples.length; i++) {
                    var wordArr = [];
                    var str = $scope.grammarTestExamples[i];
                    wordArr = $scope.grammarTestExamples[i].split(" ");
                    for (j = 0; j < wordArr.length; j++) {
                        if (findMatch(wordArr[j])) { //$scope.items.indexOf(" " + wordArr[j] + " ") != -1
                            wordArr[j] = '<input type="text" id="' + i + '_' + j + '">';
                        }
                    }
                    // $scope.grammarTestExamples[i] = wordArr.join(" "); //'<input type="text">'   //'<input type="text" id="'+ i + '.' + j +'">' //'<select ng-model="selecteditem' + j + '" ng-options="s for s in items">{{s}}</select>'

                    $scope.questions.push(wordArr); //[i] = wordArr;
                }
                $scope.noOfPages = Math.ceil($scope.questions.length / $scope.numPerPage);
                $scope.setPage();
                $scope.gtFetchInProgress = false;
            }
            else {
                $scope.gtFetchInProgress = false;
                $scope.hideNoUsageFound = false;
                $scope.showGrammarTest = false;
                $scope.dataloaded = true;
            }

        });

    }

    function findMatch(str) {
        for (i = 0; i < $scope.items.length; i++) {
            var pattern = new RegExp("(<=\\s|\\b)" + $scope.items[i] + "(?=[]\\b|\\s|$)");
            if (pattern.test(str)) {
                return true;
            }
        }
    }

    function cleanString(input) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) <= 127) {
                output += input.charAt(i);
            }
        }
        return output;
    }

    $scope.submitTest = function (arr, index) {
        var val = arr.slice();
        var ind = ($scope.numPerPage * $scope.currentPage) - ($scope.numPerPage - index);
        for (i = 0; i < val.length; i++) {
            if (val[i].indexOf('input type') !== -1) {
                val[i] = document.getElementById(ind + '_' + i).value;
            }

        }
        var finalAnswer = val.join(" ");

       // if (finalAnswer.trim().replace(/\s/g, "") == $scope.grammarTestExamples[ind].trim().replace(/\s/g, "")) {  //.replace(/\uFFFD/g, '')
        if (cleanString(finalAnswer).replace(/\s/g, "").trim() == cleanString($scope.grammarTestExamples[ind]).replace(/\s/g, "").trim()) {
            
            result = 'Correct Answer!';
            $scope.toggle = true;
        }
        else {
            result = 'Wrong Answer. Please try again.';
            $scope.toggle = false;
        }
        $scope.result = result;
        $('#resultsModalDiv').modal('show');
        return;
    }

    $scope.speak = function () {

        var output = $('#output').val();
        var locale = $('#languageoptions').val();

        if (output == undefined || output == null || output == "") {
            alert("Please enter a Word.");
            return;
        }

        //var bingClientTTS = new BingSpeech.TTSClient("518a3eeacd1343e3a55c8197e6af6cd7");
        //bingClientTTS.synthesize(output, BingSpeech.SupportedLocales.enUS_Female);


        learnService.getSpeech(output, locale);
    }


}]);
