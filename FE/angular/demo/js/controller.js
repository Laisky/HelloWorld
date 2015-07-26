// controller.js

"use strict;"

var myApp;

(function() {
    myApp = new MyApp();

    function MyApp() {
        this.myApp = angular.module('myApp', []);

        var myApp = this.myApp;

        // -----------------------------------
        // demo for controller
        myApp.controller("myController", ["$scope", function($scope) {
            // $scope 为该 controller 的命名空间
            // $scope 中也可以指定函数
            $scope.greeting = "Welcome";
            $scope.addDot = function() {
                $scope.dot += '.';
            };
        }]);

        // -----------------------------------
        // demo for service
        // 将自定义的 service 也添加进依赖注入（DI）的列表中
        myApp.controller("serviceDemo", ["$scope", "myService", function($scope, myService) {
            $scope.serviceShow = function(userInput) {
                myService(userInput);
            };
        }]);
        // 创建 service
        // service 返回的是一个函数（实例）
        myApp.factory("myService", ["$window", function($win) {
            return function(msg) {
                $win.alert(msg);
            }
        }]);

        // -----------------------------------
        // demo for filter
        myApp.filter("myFilter", function() {
            return function(input, nDot) {
                return input + ".".repeat(Number(nDot));
            }
        })
        myApp.controller("templateDemo", ["$scope", function($scope) {

        }]);


        // -----------------------------------
        // 校验整数
        var INTEGER_REGEXP = /^\-?\d+$/;

        // demo for validators
        // 定义一个叫做 integer 的 directive
        myApp.directive('integer', function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    // 设置自己的校验器
                    // 接受两个参数 modelValue & viewValue
                    ctrl.$validators.integer = function(modelValue, viewValue) {
                        // 为空时不校验
                        if (ctrl.$isEmpty(modelValue)) {
                            return true;
                        }

                        // 注意这里使用了 viewValue 而不是 modelValue
                        // 因为从 viewValue 到 modelValue 会经过 $parsers
                        // 所以 viewValue 是字符串，而 modelValue 会被 parse 成相应的类型
                        if (INTEGER_REGEXP.test(viewValue)) {
                            return true;
                        }

                        // it is invalid
                        return false;
                    };
                }
            };
        });
    }
})()
