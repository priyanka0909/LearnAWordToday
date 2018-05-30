var myApp = angular.module('myApp', ['ui.router', 'ngCookies', 'ngSanitize', 'ui.bootstrap.pagination']);  //
myApp.controller('appController', ['$scope', '$http', '$q', '$state', '$location', '$anchorScroll', '$stateParams', 'learnService', '$sce', function ($scope, $http, $q, $state, $location, $anchorScroll, $stateParams, learnService, $sce) {


    $scope.hideWelcome = false;
}]);