// Variable

let myCont = 3
var myVar = 4

println("myCont \(myCont) & myVar \(myVar)")
print("123")

typealias myInt = Int;
print(myInt.min)

// 类型推断
var myInt2 = 10
//myInt2 + 3.1
assert(myInt2 > 5, "Assert Error!")

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
print("\(myOptional!)")  // optional! 为强制解析
myOptional = nil  // 可选类型可以被设置为 nil
assert(true, "something wrong")

// 隐式可选
var myImplicitly: Int! = 200
var myNewImpl = myImplicitly // 不需要感叹号

// 可选绑定
//var possibleNumber = "abc"
var possibleNumber = "123"
if var actualNumber = possibleNumber.toInt() {
    // 如果 possibleNumber 有值的话就执行这段
    println(actualNumber)
} else {
    println("optional is nil")
}

// dict
var myOptDict = [1: 2]
myOptDict[3]
//myOptDict[3]!   will raise ERROR

// ------------------------------
// 运算符
// operator
myOptional ?? 1

10 / 2
10 + 2
10 - 2
10 % 3
10 * 2
-10
myInt2++
++myInt2
myInt2 += 2
8 % 2.5  // 浮点数求余

// 比较运算符
10 > 2
10 >= 2
10 == 2
10 != 2

// 三元运算符
var myInt3 = 10 > 20 ? 5: 3

// 空合运算符
var myOption2: Int? = nil
myOption2 ?? 3

// 区间运算符
// 1...3
// 1..<3
for i in 1...3 {
    // 1, 2, 3 闭区间
    println(i)
}

for i in 1..<3 {
    // 1, 2 开区间
    println(i)
}

// 逻辑运算符
var myBool = true
!myBool
false && true
false || true

// ------------------------------
// 字符串
var myStr: String = "abc"
var myChar: Character = "a"
myStr += "123"  // 字符串是可变的
// 虽然字符串是可变的，但其是值类型，可变的行为是通过值拷贝来实现的
"".isEmpty
println("myCont \(myCont) & myVar \(Int(Double(myVar)))")
let myStr1 = "abc"
let myStr2 = "abcde"
myStr1 == myStr2
myStr2.hasPrefix(myStr1)
myStr2.hasSuffix("cde")
myStr1.uppercaseString.lowercaseString
myStr1.utf16

for scalar in myStr {
    print(scalar)
}

for scalar in myStr1.unicodeScalars {
    print(scalar)
}

// unicode 
let sparklingHeart: String = "\u{1F496}"
let combinedEAcute: Character = "\u{65}\u{301}"

print("\(count(sparklingHeart))")  // count 计算的是 unicode 标量
print(sparklingHeart.utf16)

// 索引
print(sparklingHeart.startIndex)
print(sparklingHeart.endIndex)

// 插入 & 删除
myStr.insert("a", atIndex: myStr.endIndex)
myStr.hasPrefix("abc")
myStr.hasSuffix("a")

// 元组
var myTuple = ("NotFound", 404)
// 元组也可以命名
var myNamedTuple = (msg: "OK", statusCode: 200)
var (msg, statusCode) = myTuple
println("\(msg), \(statusCode)")

// ------------------------------
// 集合类型 Array & Set & Dictionary
// Array 数组
// 数组的初始化
var myArr1 = [Int]()
var myArr2 = [Int](count: 3, repeatedValue: 4)
var myArr3: [Int] = [1, 2, 3]
let myContArr: [Int] = [1, 2]
myArr2
var myArr = [1,2,3]
myArr.count
myArr.append(4)
myArr.insert(5, atIndex: myArr.count)
myArr + myArr2
myArr1.count
// 常量数组无法修改（插入、删除、更改）
// myContArr.append(2)
// myContArr[1] = 3

// dict
// 字典的 key 必须是 hashable 的
// 创建一个空字典
var emptyDict = Dictionary<String, String>()
var emptyDict2 = [Int: String]()

var mySmartDict = [1:2, 2:3, 3:4]  // 根据字面量来创建字典
var myDict: [String: String] = ["key": "val"]
myDict["key"]
myDict["newKey"] = "newVal"
myDict["notExistsKey"]
for (k, val) in myDict {
    println("key: \(k), val: \(val)")
}
myDict = [:]  // 又成为了一个空字典

// 字典的遍历
mySmartDict.keys
mySmartDict.values
for (k, val) in mySmartDict {
    println("key: \(k), val: \(val)")
}


// set
// 集合是无序不可重复
// 根据 hashValue 来判断是否重复，所以每一个值都必须是 hashable 的
myStr.hashValue
var mySet = Set<String>()
mySet.insert("a")
var myLiterSet: Set<Int> = [1, 2, 3, 4, 5, 6]
// 如果能确保集合的元素类型都相同的话，可以使用类型推断
var mySmartSet: Set = [5, 5, 5, 6]
mySet.contains("a")
for (k, val) in enumerate(mySmartSet) {
    println("key: \(k), val: \(val)")
}
// 集合的运算
// intersects & exclusiveOr & union & subtract
// isSubsetOf & isSupersetOf & isStrictSubsetOf & isStrictSupersetOf & isDisjointWith
var mySet1: Set = [1, 2, 3]
var mySet2: Set = [2, 3]
var mySet3: Set = [4]

mySet1.union(mySet3)
mySet1.isSupersetOf(mySet2)

// ------------------------------
// 控制流
// http://wiki.jikexueyuan.com/project/swift/chapter2/05_Control_Flow.html
// for 循环
for val in myArr {println("val: \(val)")}

// 遍历数组
for (i, val) in enumerate(myArr) {
    println("i: \(i), val: \(val)")
}


// while 循环
var myCount = 0
while myCount < 3 {
    myCount++
    println(myCount)
}

// do 循环
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
}
var inst = NewHTMLElement(name: "a", text: "ad")


// 可选链
class NewPerson {
    var residence: NewResidence?
}

class NewResidence {
    var numberOfRooms = 1
}

let newJohn = NewPerson()
newJohn.residence
if let roomCount = newJohn.residence?.numberOfRooms {
    println("John's residence has \(roomCount) room(s).")
} else {
    println("Unable to retrieve the number of rooms.")
}


// 泛型
// <T> 为类型占位符，表示某一类型
func swapTwoValues<T>(inout a: T, inout b: T) {
    let temporaryA = a
    a = b
    b = temporaryA
}

var a = 3
var b = 4
swapTwoValues(&a, &b)
println([a, b])
















