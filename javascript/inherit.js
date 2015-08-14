describe("test inherit", function() {

    /*
     * 简单的使用 构造函数 & new 实现的继承
     */
    it('简单的 new 继承', function() {
        function Animal() {}
        var dog = new Animal();
        var cat = new Animal();

        // 实例互相隔离
        cat.species = 'cat';
        expect(cat.species).not.toEqual(dog.species);

    })

    /*
     * 使用 prototype 来实现实例间共享属性
     */
    it('prototype 继承', function() {
        // 这个属性包含一个对象（以下简称"prototype对象"），
        // 所有实例对象需要共享的属性和方法，都放在这个对象里面；
        // 那些不需要共享的属性和方法，就放在构造函数里面。
        function Animal() {}
        Animal.prototype.species = 'cat';

        var animal1 = new Animal;
        var animal2 = new Animal;

        expect(animal1.species).toEqual('cat');
        expect(animal1.species).toEqual(animal2.species);
    })

});
