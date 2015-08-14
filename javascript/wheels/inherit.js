/**
 * 学习一下 JavaScript 的继承  Laisky
 * Fri Aug 14 13:36:00 2015
 */

describe('inherit', function() {

    /**
     * 简单的使用 构造函数 & new 实现的继承
     */
    it('简单的 new 继承', function() {
        function Animal() {
            this.name = 'animal';
            this.eat = function() {};
        }
        var dog = new Animal();
        var cat = new Animal();

        // 实例互相隔离
        // 每个实例都是一个全新的拷贝
        cat.species = 'cat';
        cat.name = 'damao'; // dog.name 并不会改变
        expect(cat.name).not.toBe(dog.name);
        expect(cat.eat).not.toBe(dog.eat);
        expect(cat.species).not.toBe(dog.species);
    });

    /**
     * 使用 prototype 来实现实例间共享属性
     */
    it('prototype 共享对象', function() {
        // 每个够咱函数都有一个 prototype 属性
        // 这个属性指向一个对象，在实例间共享
        function Animal() {
            this.name = 'animal';
        }
        Animal.prototype.species = 'cat';

        var cat = new Animal;
        var dog = new Animal;

        // prototype 是在实例间共享的
        expect(cat.species).toBe('cat');
        expect(cat.species).toBe(dog.species);
        // 可以判断继承关系
        expect(Animal.prototype.isPrototypeOf(cat)).toBeTruthy();
        expect(Animal.prototype.isPrototypeOf(dog)).toBeTruthy();

        // hasOwnProperty 用来检测属性是属于实例自己还是来自于 prototype
        cat.position = 'god';
        expect(cat.hasOwnProperty('position')).toBeTruthy();
        expect(cat.hasOwnProperty('name')).toBeTruthy();
        expect(cat.hasOwnProperty('species')).toBeFalsy(); // prototype 的属性不属于 OwnProperty

        // 判断属性
        expect('name' in cat).toBeTruthy();
        expect('species' in cat).toBeTruthy();
        expect('position' in cat).toBeTruthy();
    });

    /**
     * 使用 apply 应用父对象的构造函数
     * 这也是最简单的继承方法
     */
    it('apply 继承', function() {
        function Animal() {
            this.name = 'anime';
        }

        function Cat() {
            // 原理：
            // 直接调用构造函数时，构造函数内部的 this 相当于当前构造函数的 this
            Animal.apply(this, arguments);
            this.species = 'cat';
        }

        var cat = new Cat();
        expect(cat.constructor).toBe(Cat.prototype.constructor);
        expect(cat.constructor).not.toBe(Animal.prototype.constructor);
    });

    /**
     * 使用 prototype 来继承
     */
    it('prototype 继承', function() {
        function Animal() {
            this.name = 'anime';
        }

        function Cat() {}
        Cat.prototype = new Animal(); // 缺点是每次都会构建一个 Animal 实例
        Cat.prototype.constructor = Cat;

        var cat = new Cat();
        expect(cat.constructor).toBe(Cat.prototype.constructor);
        expect(cat.constructor).not.toBe(Animal.prototype.constructor);
    })

    /**
     * 轻量版的 prototype 继承
     */
    it('prototype 轻量继承', function() {
        // 使用中间空对象来继承父对象的 protorype（而不是父对象实例）
        // 使用中间空对象的目的是防止子对象篡改父辈的 prototype
        function Animal() {
            this.name = 'animal';
        }

        function tmpMiddle() {}
        tmpMiddle.prototype = Animal.prototype;

        function Cat() {}
        Cat.prototype = new tmpMiddle(); // 现在只需要实例化一个空函数
        Cat.prototype.constructor = Cat;

        var cat = new Cat();
        expect(cat.constructor).toBe(Cat.prototype.constructor);
        expect(cat.constructor).not.toBe(Animal.prototype.constructor);

        // 可以将上面的代码封装进一个函数之中
        function extend(Child, Parent) {
            var tmpMiddle = function() {};　　　　
            tmpMiddle.prototype = Parent.prototype;　　　　
            Child.prototype = new tmpMiddle();　　　　
            Child.prototype.constructor = Child;　　　　
            // 这是一个约定的属性
            // 使用 uber 直接指向父类的 prototype
            // 相当于 python 的 super
            Child.uber = Parent.prototype;
        }
    });

    /**
     * 使用非构造函数实现继承
     */
    it('对象继承', function() {
        /**
         * 使用 prototype链 来实现对象的继承
         */
        var Chinese = {
            nation: 'chinese'
        };

        function object(o) {
            function F() {}　　　　
            F.prototype = o;　　　　
            return new F();
        }
        var Doctor = object(Chinese);
        expect(Doctor.nation).toBe(Chinese.nation);

        /**
         * 使用深拷贝来实现继承
         * 不使用浅拷贝是为了防止父辈被子类篡改
         */
        function deepCopy(p, c) {　　　　
            var c = c || {};　　　　
            for (var i in p) {　　　　　　
                if (typeof p[i] === 'object') {　　　　　　　　
                    c[i] = (p[i].constructor === Array) ? [] : {};　　　　　　　　
                    deepCopy(p[i], c[i]);　　　　　　
                } else {　　　　　　　　　
                    c[i] = p[i];　　　　　　
                }　　　　
            }　　　　
            return c;　　
        }

        Chinese.chickens = ['alice', 'bob'];
        var Doctor = deepCopy(Chinese);
        Doctor.chickens.push('Caro');
        expect(Doctor.nation).toBe(Chinese.nation);
        expect(Doctor.chickens).not.toBe(Chinese.chickens);
    })
});
