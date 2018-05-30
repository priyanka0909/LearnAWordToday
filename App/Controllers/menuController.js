var myApp = angular.module('myApp');
myApp.controller('menuController',['$scope','$http', '$q','$state','$location','$anchorScroll',function($scope, $http, $q, $state,$location, $anchorScroll){

    $scope.$parent.hideWelcome = true;
    $scope.teamName = 'Cloud Angels';
    $scope.teamMembers = '387992, 576208, 685818, 307826, 537951';
    $scope.spocEmpId = '537951';
    $scope.location = 'Cognizant Hyderabad';

}]);