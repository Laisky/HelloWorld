// 测试用例
(function() {
    describe("A suite of basic functions", function() {
        var name;

        it("sayHello", function() {
            name = "Conan";
            var exp = "Hello Conan";
            expect(exp).toEqual(sayHello(name));
        });
    });

})()
