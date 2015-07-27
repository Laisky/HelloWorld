// controller.js

"use strict;"

var myApp;

(function() {
    myApp = new MyApp();

    function MyApp() {
        this.myApp = angular.module('myApp', []);

        var myApp = this.myApp;

        myApp.paths = {
            root: '/Users/laisky/repo/HelloWorld/FE/angular/demo/'
        };

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

        // demo for async validators
        myApp.directive('asyncinteger', function($q, $timeout) {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {

                    ctrl.$asyncValidators.asyncinteger = function(modelValue, viewValue) {

                        if (ctrl.$isEmpty(modelValue)) {
                            return $q.when();
                        }

                        // 创建 defer 对象
                        var def = $q.defer();

                        $timeout(function() {
                            if (INTEGER_REGEXP.test(viewValue)) {
                                // 若通过，就调用 resolve
                                def.resolve();
                            } else {
                                // 未通过就调用 reject
                                def.reject();
                            }
                        }, 2000);

                        // 必须返回 promise 对象
                        return def.promise;
                    };
                }
            };
        });

        // -----------------------------------
        // 自定义表单
        // custom form control
        myApp.directive('contenteditable', function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    // 通过设置 $setViewValue 和 $render 实现双向绑定

                    // view -> model
                    // 监听元素的 blur 事件，然后将数据传递给 model
                    elm.on('blur', function() {
                        // 调用 $setViewValue 方法设置 model 数据
                        ctrl.$setViewValue(elm.html());
                    });

                    // model -> view
                    ctrl.$render = function() {
                        elm.html(ctrl.$viewValue);
                    };

                    // load init value from DOM
                    ctrl.$setViewValue(elm.html());
                }
            };
        });
        //-----------------------------------
        // demo for directives
        myApp.controller('directiveDemo', ['$scope', function($scope) {
            $scope.customer = {
                name: 'Naomi',
                address: '1600 Amphitheatre'
            };
            $scope.naomi = {
                name: 'Naomi',
                address: '1600 Amphitheatre'
            };
            $scope.vojta = {
                name: 'Vojta',
                address: '3456 Somewhere Else'
            };
        }]);
        // 创建 directive
        myApp.directive('myCustomer', function() {
            return {
                // inline template
                template: "<p>Name: {{customer.name}} Address: {{customer.address}}.<p>",
                // 推荐做法是引入 template 文件
                // templateUrl: 'my-customer.html',
                // templateUrl 也是以是函数，接受 ele 和 attr 两个参数
                // templateUrl: function(ele, attr) {
                //     return 'customer-' + attr.type + '.html';
                // },
                // 'A' - only matches attribute name
                // 'E' - only matches element name
                // 'C' - only matches class name
                // default to 'AE'
                restrict: 'A'
            };
        });
        // 创建 isolate directive
        myApp.directive('myIsoCustomer', function() {
            return {
                restrict: 'E',
                scope: {
                    // 用属性 info 的值给 customerInfo 赋值
                    customerInfo: '=info'
                },
                // 模板内容为
                // "Name: {{customerInfo.name}} Address: {{customerInfo.address}}"
                // "<hr>" \
                // "Name: {{vojta.name}} Address: {{vojta.address}}"
                templateUrl: "/templates/my-iso-customer.html"
            };
        });
        // my-current-time
        myApp.directive("myCurrentTime", ["$interval", "dateFilter", function($interval, dateFilter) {
            return {
                link: function(scope, ele, attrs, ctrl) {
                    var timeoutId;

                    // 修改 DOM
                    function updateTime() {
                        ele.val(dateFilter(new Date(), 'M/d/yy h:mm:ss a'));
                    }

                    // 当 element destroy 的时候会抛出这个事件
                    // 注销掉计时器
                    ele.on('$destroy', function() {
                        $interval.cancel(timeoutId);
                    });

                    timeoutId = $interval(function() {
                        updateTime(); // update DOM
                    }, 1000);
                }
            }
        }]);
    }
})()
