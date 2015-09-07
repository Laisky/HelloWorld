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

});


describe('Promisse', function() {

});
