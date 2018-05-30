angular.module('myApp')
    .service('learnService', ['$http', '$q', function ($http, $q) {

        var serv = {};

        serv.getExamples = function (searchValue) {

            var deferred = $q.defer();

            url = "http://localhost:49981/api/Search/BingCustomSearch/" + searchValue;

            $http.get(url).then(function (response) {

                deferred.resolve(response);
                if (response !== null && response.data !== null && response.data.length > 0) {
                    return response;
                }

            })

            return deferred.promise;

        }

        serv.getSpeech = function (outputText,locale)
        {

            var deferred = $q.defer();
            url = "http://localhost:49981/api/Search/TextToSpeech/";
            var obj = { 'OutputText': outputText, 'Locale': locale };
            

            $http.post(url,obj).then(function (response)
            {
                deferred.resolve(response);
                if (response !== null && response.data !== null && response.data.length > 0) {
                    return response;
                }
            })

            return deferred.promise;
        }

        serv.getMeanings = function (searchValue) {

            var deferred = $q.defer();

            url = "http://localhost:49981/api/Search/DefinitionSearch/" + searchValue.toLowerCase();

            $http.get(url).then(function (response) {

                deferred.resolve(response);
                if (response !== null && response.data !== null && response.data.length > 0) {
                    return response;
                }
                else return null;

            })

            return deferred.promise;

        }

        serv.getGrammarTypeLists = function (searchValue) {

            var deferred = $q.defer();

            url = "http://localhost:49981/api/DocumentDB/GetDocDBData/" + searchValue;

            $http.get(url).then(function (response) {

                deferred.resolve(response);
                if (response !== null && response.data !== null && response.data.length > 0) {
                    return response;
                }

            })

            return deferred.promise;

        }

        return serv;



    }])