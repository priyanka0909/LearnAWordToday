angular.module('myApp')
    .directive('selectDirective', function () {

        return {

            Restrict: 'E',
            templateUrl: './Partials/SelectDirective.html',
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {

                //$element.find('#labelPanel').append($transclude());

            }


        }


    });




//.directive('compile', ['$compile', function ($compile) {
//    return function(scope, element, attrs) {
//        scope.$watch(
//            function(scope) {
//                // watch the 'compile' expression for changes
//                return scope.$eval(attrs.compile);
//            },
//            function(value) {
//                // when the 'compile' expression changes
//                // assign it into the current DOM
//                element.html(value);

//                // compile the new DOM and link it to the current
//                // scope.
//                // NOTE: we only compile .childNodes so that
//                // we don't get into infinite loop compiling ourselves
//                $compile(element.contents())(scope);
//            }
//        );
//    };
//}])

//.directive('compile', ['$compile', function ($compile) {
//    return function (scope, element, attrs) {
//        var ensureCompileRunsOnce = scope.$watch(
//          function (scope) {
//              // watch the 'compile' expression for changes
//              return scope.$eval(attrs.compile);
//          },
//          function (value) {
//              // when the 'compile' expression changes
//              // assign it into the current DOM
//              element.html(value);

//              // compile the new DOM and link it to the current
//              // scope.
//              // NOTE: we only compile .childNodes so that
//              // we don't get into infinite loop compiling ourselves
//              $compile(element.contents())(scope);

//              // Use un-watch feature to ensure compilation happens only once.
//              ensureCompileRunsOnce();
//          }
//      );
//    };

//.directive('bindHtmlCompile', ['$compile', function ($compile) {
//    return {
//        restrict: 'A',
//        link: function (scope, element, attrs) {
//            scope.$watch(function () {
//                return scope.$eval(attrs.bindHtmlCompile);
//            }, function (value) {
//                // Incase value is a TrustedValueHolderType, sometimes it
//                // needs to be explicitly called into a string in order to
//                // get the HTML string.
//                element.html(value && value.toString());
//                // If scope is provided use it, otherwise use parent scope
//                var compileScope = scope;
//                if (attrs.bindHtmlScope) {
//                    compileScope = scope.$eval(attrs.bindHtmlScope);
//                }
//                $compile(element.contents())(compileScope);
//            });
//        }
//    };
//}]);

//.directive('compileTemplate', function($compile, $parse){
//    return {
//        link: function(scope, element, attr){
//            var parsed = $parse(attr.ngBindHtml);
//            function getStringValue() { return (parsed(scope) || '').toString(); }

//            //Recompile if the template changes
//            scope.$watch(getStringValue, function() {
//                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
//            });
//        }         
//    }
//});