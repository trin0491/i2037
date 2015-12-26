///<reference path="../../../../typings/tsd.d.ts" />

    interface ISpinner {
        stop(): void;
        spin(elem): void;
    }

    interface ISpinnerWindow extends ng.IWindowService {
        Spinner: new (options:any) => ISpinner;
    }

export default angular.module('i2037.directives.spinner', [])

        .directive("i2SpinShow", ['$window', function($window: ISpinnerWindow) {
        return function(scope, element, attrs) {

            var spinner: ISpinner;

            function start(optsExpr) {
                if (!spinner) {
                    var options = scope.$eval(optsExpr) || {};
                    spinner = new $window.Spinner(options);
                    spinner.spin(element[0]);
                }
            }

            function stop() {
                if (spinner) {
                    spinner.stop();
                    spinner = null;
                }
            }

            scope.$watch(attrs.i2SpinShow, function(isLoading) {
                if (isLoading) {
                    start(attrs.i2SpinOpts);
                } else {
                    stop();
                }
            });

            if (attrs.i2SpinOpts) {
                scope.$watch(attrs.i2SpinOpts, function(options) {
                    if (spinner) {
                        stop();
                        start(options);
                    }
                });
            }

            scope.$on('$destroy', function() {
                stop();
            });
        };
    }])
    ;
