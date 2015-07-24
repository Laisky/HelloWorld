(function() {
    var myApp = angular.module('myApp', []);


    myApp.controller('myController', ["$scope", function($scope) {
        // $scope 为该 controller 的命名空间
        $scope.greeting = "Welcome";
    }]);
})()
