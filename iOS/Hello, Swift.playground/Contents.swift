let myCont = 3
var myVar = 4

println("myCont \(myCont) & myVar \(myVar)")

// Number
let minValue = UInt8.min  // minValue 为 0，是 UInt8 类型的最小值
let maxValue = UInt8.max  // maxValue 为 255，是 UInt8 类型的最大值
let myDouble: Double = 3.14
let myFloat: Float = 3.14

// type convert
var c: Int = 3
// c + 0.1 is ERROR
Double(c) + 1 is Double
Float(c) + 1.1

// digit & octal & hex
let decimalInteger = 17
let binaryInteger = 0b10001       // 二进制的17
let octalInteger = 0o21           // 八进制的17
let hexadecimalInteger = 0x11     // 十六进制的17

// optional
"123".toInt()
"abc".toInt()
var myOptional: Int? = 404
myOptional = nil
assert(true, "something wrong")
var myOptDict = [1: 2]
myOptDict[3]
//myOptDict[3]!   will raise ERROR

// 可选绑定
//var possibleNumber = "abc"
var possibleNumber = "123"
if var actualNumber = possibleNumber.toInt() {
    println(actualNumber)
} else {
    println("optional is nil")
}

// operator
myOptional ?? 1

// range
for i in 1...3 {
    // 1, 2, 3 闭区间
    println(i)
}

for i in 1..<3 {
    // 1, 2 开区间
    println(i)
}

// bool
var myBool = true
!myBool
false && true
false || true

// String
println("myCont \(myCont) & myVar \(Int(Double(myVar)))")
let myStr1 = "abc"
let myStr2 = "abcde"
myStr1 == myStr2
myStr2.hasPrefix(myStr1)
myStr1.uppercaseString.lowercaseString
myStr1.utf16
for scalar in myStr1.unicodeScalars {
    print(scalar)
}


// collection
// Array
var myArr1 = [Int]()
var myArr2 = [Int](count: 3, repeatedValue: 4)
myArr2
var myArr = [1,2,3]
myArr.count
myArr.append(4)
myArr.insert(5, atIndex: myArr.count)
for val in myArr {println("val: \(val)")}
for (i, val) in enumerate(myArr) {
    println("i: \(i), val: \(val)")
}
// dict
var emptyDict = Dictionary<String, String>()
var myDict: [String: String] = ["key": "val"]
myDict["key"]
myDict["newKey"] = "newVal"
myDict["notExistsKey"]
for (k, val) in myDict {
    println("key: \(k), val: \(val)")
}
// loop
var myCount = 0
while myCount < 3 {
    myCount++
    println(myCount)
}
myCount = 0
do {myCount++}
while myCount < 3

1..<3
1...5

if true {} else if true {} else {}

var myCondition = "a"
switch myCondition {
case "a", "b":
    println()
    // swift 不需要 break
case _:
    // 匹配任意
    fallthrough
default:
    println()
}

var myCondition2 = (1, 2)
switch myCondition2 {
case (1,2):
    break
case (var x, 2):
    break
case (var x, var y) where x < y:
    break
case(1...3, 2):
    break
case(_, 2):
    break
default:
    break
}

// function
func sayHello(yourName: String) -> String {
    let message = "Hello, \(yourName)"
    println(message)
    return message
}
sayHello("Laisky")

func sayHelloWithNamedArgs(yourName Name: String) -> String {
    let message = "Hello, \(Name)"
    println(message)
    return message
}
sayHelloWithNamedArgs(yourName: "Laisky")

func sayHelloWithDefaultAegs(#yourName: String = "Laisky") -> String {
    let message = "Hello, \(yourName)"
    println(message)
    return message
}
sayHelloWithDefaultAegs()

func multiArgs(args: Int...) {
    for i in args {
        println(i)
    }
}
multiArgs(1,2,3,4,5)

func funcCanChangeArgs(inout #arg: String) {
    // inout 会使得参数可在函数内被修改
    arg += ",ninini"
}
var origArg = "ohohoh"
funcCanChangeArgs(arg: &origArg) // inout 参数需要使用 &

func chooseStepFunction(backwards: Bool) -> (Int) -> Int {
    func stepForward(input: Int) -> Int { return input + 1 }
    func stepBackward(input: Int) -> Int { return input - 1 }
    return backwards ? stepBackward : stepForward
}

// closure
var names = [1,4,5,2,3]
sorted(names)

func backwards(s1: Int, s2: Int) -> Bool {
    return s1 > s2
}
var reversed = sorted(names, backwards)
reversed = sorted( names, { (s1: Int, s2: Int) -> Bool in return s1 > s2 } )
reversed = sorted(names, { s1, s2 in return s1 > s2 } )
reversed = sorted(names, { $0 > $1 } )
reversed = sorted(names, >)
reversed = sorted(names) { $0 > $1 }

reversed.map {
    // map 只有一个参数，所以可以直接用尾闭包，而不用加括号
    ( var number ) -> String in
    return String(number)
}

// Closure: capture value
func makeIncrementor(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementor() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementor
}
let incrementor = makeIncrementor(forIncrement: 1)
for _ in 1...3 { incrementor() }
// 通过闭包来赋值
class SomeClass {
    let someProperty: Int = {
        // 在这个闭包中给 someProperty 创建一个默认值
        // someValue 必须和 SomeType 类型相同
        return 10
        }()
}


// Enumerate
enum myEnum: Int {
    case val1 = 1
}
myEnum.val1

// Class & Struct
// 类是引用类型，结构体是值类型
class MyClass {
    var val = 10  // 实例属性
    var computeInstVar: Int {
        // 计算属性
        return 10
    }
    init (initVal: Int) {
        val = initVal
    }
    static var staticClassVar = 10 // 类属性
    static var computeClassVar: Int {
        // 计算属性
        return 10
    }
    class func ClassMethod() -> () {
        println("class method")
    }
    func myMethod() -> () {
        println("Class Method")
    }
    func myFuncWithSelf(val: Int) {
        self.val = val
    }
}
struct MyStruct {
    var val = 10 // 结构体的变量是不能改变的，除非使用 mutating
    static var classVar = 10
    lazy var lazyVar = 1
    mutating func struFuncCanChangeVar() {
        // 结构体是值类型，不能直接修改，需要定义 mutating 方法
        self.val = 3
    }
}

var myClassInst = MyClass(initVal: 22)
var myStructInst = MyStruct()
myClassInst.myFuncWithSelf(2)
myClassInst.val
myClassInst.val = 11
myClassInst.computeInstVar
// myClassInst.computeInstVar = 11 // 常量属性
MyClass.staticClassVar
MyClass.computeClassVar
MyClass.ClassMethod()

// Value & Reference
var structCopy = myStructInst
var classCopy = myClassInst
myClassInst === classCopy

struct myPoint {
    var x: Int
    var y: Int
}
struct myPoints {
    var p1: myPoint
    var p2: myPoint
    var center: myPoint {
        get {
            return myPoint(x:p1.x + p2.x, y:p1.y + p2.y)
        }
        set(newPoint) {
            // var center 已经定义了类型
            p1 = newPoint // 若未定义参数，可以用默认名 newValue
            // center = myPoint(x: newPoint.x, y: newPoint.y)
        }
        // 属性观察期不能和 get set 同用
        // willSet(val) {println("will set \(val)")}
        // didSet {println("did set \(oldValue)")}
    }
}
var p1 = myPoint(x:1, y:2)
var p2 = myPoint(x:3, y:4)
var ps = myPoints(p1:p1, p2:p2)
ps.center
ps.center = p1

// subscript
struct structToConstructDict {
    subscript(index: Int) -> Int {
        // 下标脚本的参数没有数量和类型的限制，可以任意构造
        return index
    }
}
var myDiyDict = structToConstructDict()
myDiyDict[5]


// inheritance
class MyBaseClass {
    var baseStoredVar: Int = 15
    var baseVar: Int {
        // 貌似只有计算型属性可以重载
        return 10
    }
    final var baseVarCanNotOverride = 20  // final 可以拒绝重载
    func baseMethod(base: Int) {
        println("parent method")
    }
}
class MyChildClass: MyBaseClass {
    // 重载属性
    // 重载属性必须写明类型
//    override var baseStoredVar = 25
    override var baseVar: Int { return 20 }
    // 重载函数
    override func baseMethod(base: Int) {
        println("child method")
    }
}

// construct
struct Size {
    var width = 0.0, height = 0.0
}
struct Point {
    var x = 0.0, y = 0.0
}
struct Rect {
    var origin = Point()
    var size = Size()
    // 构造器
    init() {}
    init(origin: Point, size: Size) {
        self.origin = origin
        self.size = size
    }
    init(center: Point, size: Size) {
        let originX = center.x - (size.width / 2)
        let originY = center.y - (size.height / 2)
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}

// 指定构造器 & 便利构造器
// 0. 如果子类没有定义任何指定构造器，它将自动继承所有父类的指定构造器。
// 0. 如果子类提供了所有父类指定构造器的实现--不管是通过规则1继承过来的，还是通过自定义实现的--它将自动继承所有父类的便利构造器。
class Food {
    var name: String
    init(name: String) {
        self.name = name
    }
    convenience init() {
        self.init(name: "[Unnamed]")
    }
}
class RecipeIngredient: Food {
    var quantity: Int
    init(name: String, quantity: Int) {
        self.quantity = quantity
        super.init(name: name)
    }
    override convenience init(name: String) {
        // 便利构造器
        self.init(name: name, quantity: 1)
    }
}
var myReciInst = RecipeIngredient(name: "Child")

// 可失败构造器
struct Animal {
    let species: String
    init?(species: String) {  // 可失败构造器用 init?
        if species.isEmpty { return nil }  // 构造失败用 returnn nil
        self.species = species
    }
}
var animal = Animal(species: "")
animal
//类的可失败构造器只能在所有的类属性被初始化后和所有类之间的构造器之间的代理调用发生完后触发失败行为

// 根本跑不通啊卧槽
class Product {
    let name: String!  // 因为构造有可能失败，所以将 name 声明为可选类型
    init?(name: String) {
        self.name = name
        if name.isEmpty { return nil }
        // self.name = name  // 教材骗人
    }
}
class CartItem: Product {
    let quantity: Int!
    init?(name: String, quantity: Int) {
        self.quantity = quantity
        super.init(name: name)
        if quantity < 1 { return nil }
        // self.quantity = quantity // 教材骗人
    }
}

// deinitialization
// 析构函数用 deinit 声明
class Paohui {
    deinit {
        println("要死要死要死")
    }
}
var paohui: Paohui? = Paohui()
paohui = nil


// 引用
// 强引用 & 弱引用 & 无主引用（unowned reference）
class Person {
    let name: String
    init(name: String) { self.name = name }
    var apartment: Apartment!
    deinit { println("\(name) is being deinitialized") }
}
class Apartment {
    let number: Int
    init(number: Int) { self.number = number }
    weak var tenant: Person!
    deinit { println("Apartment #\(number) is being deinitialized") }
}

var john: Person!
var number73: Apartment!

john = Person(name: "John Appleseed")
number73 = Apartment(number: 73)

john.apartment = number73
number73.tenant = john

// 无主引用和弱引用很相似，无主引用总是有值的，所以不用 optional，而弱引用必须用 optional
// 用 unowned 声明
class Customer {
    let name: String
    var card: CreditCard?
    init(name: String) {
        self.name = name
    }
    deinit { println("\(name) is being deinitialized") }
}
class CreditCard {
    let number: Int
    unowned let customer: Customer
    init(number: Int, customer: Customer) {
        self.number = number
        self.customer = customer
    }
    deinit { println("Card #\(number) is being deinitialized") }
}

// 闭包循环引用
class HTMLElement {
    
    let name: String
    let text: String?
    
    lazy var asHTML: () -> String = {
        // 在闭包中引用了 self，导致循环引用
        if let text = self.text {
            return "<\(self.name)>\(text)</\(self.name)>"
        } else {
            return "<\(self.name) />"
        }
    }
        
    init(name: String, text: String? = nil) {
        self.name = name
        self.text = text
    }
}
// 用捕获列表解决闭包循环引用
// 捕获列表中的每个元素都是由weak或者unowned关键字和实例的引用（如self或someInstance）成对组成。每一对都在方括号中，通过逗号分开
// Swift 有如下要求：只要在闭包内使用self的成员，就要用self.someProperty或者self.someMethod（而不只是someProperty或someMethod）。这提醒你可能会不小心就捕获了self
class NewHTMLElement {
    
    let name: String
    let text: String?
    
    lazy var asHTML: () -> String = {
        // 闭包函数有参数时 [unowned self] (index: Int, stringToProcess: String) -> String in
        // 闭包函数无参数时 [unowned self] in
        [unowned self] in
        if let text = self.text {
            return "<\(self.name)>\(text)</\(self.name)>"
        } else {
            return "<\(self.name) />"
        }
    }
    
    init(name: String, text: String? = nil) {
        self.name = name
        self.text = text
}



















