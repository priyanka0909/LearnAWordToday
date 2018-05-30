angular.module('myApp')
    .config(function ($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider) {

        $urlMatcherFactoryProvider.caseInsensitive(true);

        $stateProvider

            .state("Welcome", {
                url: "/Welcome",
                templateUrl: "Partials/Welcome.html",
                controller: "mainController"
            })

            .state("Learn", {
                url: "/",
                templateUrl: "Partials/Learn.html",
                controller: "mainController"

            })

            .state("Grammar", {
                url: "/Grammar",
                templateUrl: "Partials/Grammar.html",
                params: { 'type': null },
                controller: "mainController"

            })

            .state("Dragdrop", {
                url: "/Dragdrop",
                templateUrl: "Partials/JumbledSentences.html",
                params: { 'questions': null },
                controller: "dragdropController"

            })

            .state("Contact", {
                url: "/Contact",
                templateUrl: "Partials/Contact.html",
                controller: "menuController"

            })


       // $urlRouterProvider.otherwise('/Welcome'); //Donotuse

    });
