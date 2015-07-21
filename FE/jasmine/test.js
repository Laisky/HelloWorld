// 测试用例
describe("A suite of basic functions", function() {
    var name;

    // test case 1
    it("sayHello", function() {
        name = "Conan";
        var exp = "Hello Conan";
        expect(exp).toEqual(sayHello(name));
    });

});

describe("A suite of jasmine's function", function() {
    describe("Expectations", function() {
        it("Expectations", function() {
            expect("AAA").toEqual("AAA");
            expect(52.78).toMatch(/\d*.\d\d/);
            expect(null).toBeNull();
            expect("ABCD").toContain("B");
            expect(52, 78).toBeLessThan(99);
            expect(52.78).toBeGreaterThan(18);

            var x = true;
            var y;
            expect(x).toBe(true);
            expect(x).toBeDefined();
            expect(y).toBeUndefined();
            expect(x).toBeTruthy();
            expect(!x).toBeFalsy();
        });

        it("ErrorCase", function() {
            expect("True").toEqual("True");
            // except("True").toEqual("False");
        })
    });
});
