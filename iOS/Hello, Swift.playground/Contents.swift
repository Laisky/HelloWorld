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

func newExtendFunc(externalFunc: String ->nil){}















