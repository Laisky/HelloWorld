/**
 * 学习一下 JavaScript 的继承  Laisky
 * Fri Aug 14 13:36:00 2015
 */

describe('inherit', function() {

    /*
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
        cat.name = 'damao';  // dog.name 并不会改变
        expect(cat.name).not.toEqual(dog.name);
        expect(cat.eat).not.toEqual(dog.eat);
        expect(cat.species).not.toEqual(dog.species);
    });

    /*
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
        expect(cat.species).toEqual('cat');
        expect(cat.species).toEqual(dog.species);
        // 可以判断继承关系
        expect(Animal.prototype.isPrototypeOf(cat)).toBeTruthy();
        expect(Animal.prototype.isPrototypeOf(dog)).toBeTruthy();

        // hasOwnProperty 用来检测属性是属于实例自己还是来自于 prototype
        cat.position = 'god';
        expect(cat.hasOwnProperty('position')).toBeTruthy();
        expect(cat.hasOwnProperty('name')).toBeTruthy();
        expect(cat.hasOwnProperty('species')).toBeFalsy();  // prototype 的属性不属于 OwnProperty

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
        expect(cat.constructor).toEqual(Cat.prototype.constructor);
        expect(cat.constructor).not.toEqual(Animal.prototype.constructor);
    });

});
