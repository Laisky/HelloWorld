-- 我是注释

--[[
我也是注释
--]]

----------------------------
-- 变量
-- 在 lua 中，_G 指向全局作用域
-- 可以用 _G.variableName 引用全局变量

-- 未显式使用 local 定义的都是全局变量
-- 数字都是 64 bits double
local num = 0

-- 字符串
char = '123'
multilinechar = [[
123]]
char1, char2 = 'a', 'b'
print(char == multilinechar) -- true
print(char1 .. char2) -- 连接字符串

-- 拼接长字符串最好用 table.concat
my_list = {1, 2, "c", 'a'}
local pieces = {}
for i, elem in ipairs(my_list) do
  pieces[i] = elem
end
local res = table.concat(pieces)
print(res)

--[[
%c - 接受一个数字, 并将其转化为ASCII码表中对应的字符
%d, %i - 接受一个数字并将其转化为有符号的整数格式
%o - 接受一个数字并将其转化为八进制数格式
%u - 接受一个数字并将其转化为无符号整数格式
%x - 接受一个数字并将其转化为十六进制数格式, 使用小写字母
%X - 接受一个数字并将其转化为十六进制数格式, 使用大写字母
%e - 接受一个数字并将其转化为科学记数法格式, 使用小写字母e
%E - 接受一个数字并将其转化为科学记数法格式, 使用大写字母E
%f - 接受一个数字并将其转化为浮点数格式
%g(%G) - 接受一个数字并将其转化为%e(%E, 对应%G)及%f中较短的一种格式
%q - 接受一个字符串并将其转化为可安全被Lua编译器读入的格式
%s - 接受一个字符串并按照给定的参数格式化该字符串
]]--

-- 通过 string.format() 来使用占位符
print(string.format("pi = %.4f", math.pi))

-- bool
-- 仅有 false 和 nil 为假，其他都为真

print('type(char)', type(char))
print('type(multilinechar)', type(multilinechar))
print('type(char1)', type(char1))
print('type(num)', type(num))
print('type(nil)', type(nil))
print('type(true)', type(true))
print('type(true)', type(true))

-- 运算
print('1 + 1', 1 + 1)
print('1 - 1', 1 - 1)
print('10 * 2', 10 * 2)
print('10 / 2', 10 / 2)
print('10 % 2', 10 % 2)
print('10 ^ 2', 10 ^ 2)

----------------------------
-- while
-- 没有 continue
-- 只有 break
while num <= 100 do
  num = num + 1
end
print(num) -- 101
print(100)
print(100LL) -- luajit 支持的长整数类型
print(100.0)

----------------------------
-- if
print('1 < 2', 1 < 2)
print('1 > 2', 1 > 2)
print('1 <= 2', 1 <= 2)
print('1 >= 2', 1 >= 2)
print('1 == 2', 1 == 2)
print('1 ~= 2', 1 ~= 2)

-- 逻辑运算
print('true and false', true and false)
print('false or true', false or true)
print('not false', not false)

if 1 == 1 then
  print('1 == 1')
elseif 1 ~= 2 then
  print('1 == 2')
else
  print('else')
end

----------------------------
-- for

-- 最简单的，循环数字
-- begin, finish, step
-- 可以无限循环 for i=1, math.huge do
for i=1, 10, 2 do
  print(i)
end

-- 遍历 array 中的 keys
local a = {"a", "b", "c", "d"}
for k in pairs(a) do
  print("keys:", k)
end

-- 遍历 array
local a = {"a", "b", "c", "d"}
for i, v in ipairs(a) do
  print("index:", i, " value:", v)
end

----------------------------
-- until
-- 条件为假时才退出循环
i = 9
repeat
  print(i)
  i = i - 2
until i <= 0

----------------------------
-- 函数
function fib(n)
  if n < 2 then return 1 end
  return fib(n - 2) + fib(n - 1)
end

print(fib(10))

----------------------------
-- 闭包
function newCounter()
  local i = 0
  return function()
    i = i + 1
    return i
  end
end
print('newCounter',newCounter()())

----------------------------
-- 匿名函数
anomaFunc = function() return 10 end

----------------------------
-- Table（映射）
-- key 可以是除了 nil 外的任意类型
myObj = {['a']=1, b='abc', ['c']=true, d=13}

-- 遍历 key 和 value
for k, v in pairs(myObj) do
  print('table pairs for kv:', k, v)
end

-- 只遍历 key
for k in pairs(myObj) do
  print('table pairs for k:', k)
end

-- ipars 不能用于 table

----------------------------
-- 数组
-- 数组小标从 1 开始
myArr = {1, '2', 'c'}
for i=1, #myArr do -- #myArr 是取 myArr 的长度
  print(myArr[i])
end

----------------------------
-- function 函数
-- table 参数是引用传递，其他参数都是值传递（拷贝）

function simple(a)
  print(string.format("simpe(%q)", a))
end

simple(123)

-- 尽量不要定义全局函数，都加上 local 关键字
local function foo()
  print("in the function")
  --dosomething()
  local x = 10
  local y = 20
  return x + y
end

local a = foo --把函数赋给变量

print(a())

-- 用 ... 表示变长参数
-- 无法被 jit 支持，所以尽量少用
local function bar(...)
  local data = {...}
  local ret = table.concat(data, "!")
  print(ret)
end

bar("变长参数：", bar(1,2,3))

----------------------------
--[[
MetaMethod & MetaTable
即重载操作符

__add(a, b) 对应表达式 a + b
__sub(a, b) 对应表达式 a - b
__mul(a, b) 对应表达式 a * b
__div(a, b) 对应表达式 a / b
__mod(a, b) 对应表达式 a % b
__pow(a, b) 对应表达式 a ^ b
__unm(a) 对应表达式 -a
__concat(a, b) 对应表达式 a .. b
__len(a) 对应表达式 #a
__eq(a, b) 对应表达式 a == b
__lt(a, b) 对应表达式 a < b
__le(a, b) 对应表达式 a <= b
__index(a, b) 对应表达式 a.b
__newindex(a, b, c) 对应表达式 a.b = c
__call(a, ...) 对应表达式 a(...)
]]--
tableA = {val=1}
tableB = {val=2}

fraction_op = {}
function fraction_op.__add(a, b)
  return a.val + b.val
end

setmetatable(tableA, fraction_op)
setmetatable(tableB, fraction_op)
print(tableA + tableB)

----------------------------
--[[ 模块

lua 有三种载入方式：
- require('filename') -- 只有第一次会执行
- dofile('filename') -- 每次都执行
- submodule = loadfile('filename') -- 载入但不执行，可调用 submodule() 执行
]]--

local sm = require('simple_module')
print("simple module")
sm.demo()
