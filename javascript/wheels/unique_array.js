/**
 * 列表去重问题
 * http://www.shamasis.net/2009/09/fast-algorithm-to-find-unique-items-in-javascript-array/
 */


'use strict';


function generateRandomChar() {
    let n = Math.round(Math.random() * 10);
    if (Math.random() > 0.5) {
        return n;
    } else {
        return n.toString();
    }
}


function generateRandomArray(length) {
    let r = [];
    length = length || 10;
    for (let i = 0; i < length; i++) {
        r.push(generateRandomChar());
    }
    return r
}


describe('列表去重', function() {
    const testArr = generateRandomArray(10);
    const result = $.unique(testArr);


    // O(2n)
    it('普通办法', function() {
        function unique(array) {
            let o = {},
                i, l = array.length,
                r = [];
            for (i = 0; i < l; i += 1) o[array[i]] = array[i];
            for (i in o) r.push(o[i]);
            return r;
        }

        let r = unique([1, 2, 2, 3]);  // 只能处理字符串
        expect(r).toEqual([1, 2, 3]);

    });


    // O(n^2)
    it('快速方法', function() {
        function unique(array) {
            var a = [],
                l = array.length;
            for (var i = 0; i < l; i++) {
                for (var j = i + 1; j < l; j++)
                    if (array[i] === array[j]) j = ++i;
                a.push(array[i]);
            }
            return a;
        }

        let r = unique(testArr);
        expect(r).toEqual(result);
    });

});
