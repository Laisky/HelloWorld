// controller.js

(function() {
    var myApp = angular.module('myApp', []);

    myApp.controller('myController', ["$scope", function($scope) {
        // $scope 为该 controller 的命名空间
        // $scope 中也可以指定函数
        $scope.greeting = "Welcome";
        $scope.addDot = function() {
            $scope.dot += '.';
        };
    }]);
})()
