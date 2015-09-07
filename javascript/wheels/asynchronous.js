/**
 * 学习一下 javascript 和 jquery 里的各种异步
 * Mon Sep  7 10:56:17 2015
 */


/**
 * javascript 里内置的一些定时器
 */
describe('定时器', function() {

    beforeEach(function() {
        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('简单的 setTimeout', function() {
        var result = [];
        setTimeout(function() {
            result.push(1);
        }, 100);

        jasmine.clock().tick(101);
        expect(result).toEqual([1]);
    });

    it('简单的 setInterval', function() {
        var result = '';
        var myInter = setInterval(function() {
            result += 'ni';
        }, 100);
        jasmine.clock().tick(501);
        clearInterval(myInter);
        expect(result).toEqual('ninininini');
    })

    /**
     * 下面的各种情形在 setTimeout 和 setInterval 中同样适用，就不各自重复写了
     */
    it('绑定对象方法', function() {
        var result;
        window.myVar = 10; // 设定全局变量

        function MyObj() {
            this.myVar = 5;
            this.getVar = function() {
                result = this.myVar;
            }
        }

        var myObj = new MyObj();

        // 正常调用时，得到的是对象内的 this.myVar
        myObj.getVar()
        expect(result).toEqual(5);

        // 直接将对象方法绑定到 setTimeout 的话，this 会指向全局
        // 如果使用了严格模式，所以 this 会指向 null，导致报错
        // setInterval 有相同的问题
        setTimeout(myObj.getVar, 100);
        jasmine.clock().tick(101);
        expect(result).toEqual(10);


        // 解决的办法是将对象方法嵌套在函数内
        jasmine.clock().tick(0);
        setTimeout(function() {
            myObj.getVar();
        }, 100);
        jasmine.clock().tick(101);
        expect(result).toEqual(5); // 现在就能得到正确的值
    });

    it('添加到下一次事件循环', function() {
        // setInterval & setTimeout 都是利用 event loop
        // 将 function 添加到下一次事件循环的队列尾端
        var result = '';
        setTimeout(function() {
            result += 'bing';
        }, 0);
        result += 'bong';
        jasmine.clock().tick(5);
        // setTimeout 在后一次事件循环中执行
        expect(result).toEqual('bongbing');
    });
});


describe('Deffered', function() {

    beforeEach(function() {
        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('Deffered 常用用法', function() {
        /**
         * 假设有一个特别耗时的操作
         */
        function longTimeOper() {
            var dtd = $.Deferred();
            setTimeout(function() {
                // resolve 会调用 done
                // reject 会调用 fail
                dtd.resolve('ok!');
            }, 100);
            return dtd.promise(); // 返回一个 promise 对象
        }

        var result = '';
        longTimeOper()
            // 就可以使用链式语法了
            .done(function(msg) {
                result = msg;
            });

        jasmine.clock().tick(101);
        expect(result).toEqual('ok!');
    });
});


/**
 * 类似于 jQuery 的 Deffered，但是是 ES6 的原生实现
 */
describe('Promise', function() {

    beforeEach(function() {
        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('promise 常用用法', function(done) {
        function longTimeOper(isSuccess) {
            var promise = new Promise(function(resolve, reject) {
                setTimeout(function() {
                    if (isSuccess) {
                        resolve('ok!');
                    } else {
                        reject('fail!');
                    }
                }, 100);
            });

            return promise;
        }

        var successResult = '';
        var failResult = '';
        longTimeOper(true)
            .then(function(msg) {
                expect(msg).toEqual('ok!');
                done();
            });

        jasmine.clock().tick(101);
    });

    /**
     * 因为 Promise 是将任务添加到当前事件循环的队列尾
     * 而 setTimeout 是将任务添加到下一个事件循环的队列尾
     * 所以 Promise 会比 setTimeout 先执行
     */
    it('添加到当前时间循环的队列尾', function(done) {
        jasmine.clock().uninstall();
        var result = '';
        setTimeout(function() {
            result += 'ping';
        }, 0);
        Promise.resolve().then(function() {
            console.log(result);
            result += 'pong';
        });
        setTimeout(function() {
            expect(result).toEqual('pongping');
            done();
        }, 1)
    });

});
