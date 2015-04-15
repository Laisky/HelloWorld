let myCont = 3
var myVar = 4

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

1..<3





