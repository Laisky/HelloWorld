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
        myApp.controller('myController', ["$scope", function($scope) {
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
    }
})()
