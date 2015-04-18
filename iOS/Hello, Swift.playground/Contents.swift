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
    arg += ",ninini"
}
var origArg = "ohohoh"
funcCanChangeArgs(arg: &origArg)

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

var myClassInst = MyClass()
var myStructInst = MyStruct()
myClassInst.myFuncWithSelf(2)
myClassInst.val
myClassInst.computeInstVar
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

















