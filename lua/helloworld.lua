-- 我是注释

--[[
我也是注释
--]]

-- 数字都是 64 bits double
num = 0

-- 字符串
char = '123'
multilinechar = [[
123]]
char1, char2 = 'a', 'b'
print(char == multilinechar)  -- true

-- 在 lua 中，_G 指向全局作用域
-- 可以用 _G.variableName 引用全局变量

-- while
while num <= 100 do
    num = num + 1
end
print(num)  -- 101

-- if
--[[
== 等于
~= 不等于
--]]
if 1 == 1 then
    print('1 == 1')
elseif 1 ~= 2 then
    print('1 == 2')
else
    print('else')
end

-- for
for i=1, 10, 2 do
    print(i)
end

-- until
i = 9
repeat
    print(i)
    i = i - 2
until i <= 0

-- 函数
function fib(n)
  if n < 2 then return 1 end
  return fib(n - 2) + fib(n - 1)
end

print(fib(10))


-- 闭包
function newCounter()
    local i = 0
    return function()
       i = i + 1
        return i
    end
end
print(newCounter()())

-- 匿名函数
anomaFunc = function() return 10 end

-- Table（映射）
myObj = {['a']=1, ['b']='abc', ['c']=True}
for k, v in pairs(myObj) do
    print(k, v)
end

-- 数组
-- 数组小标从 1 开始
myArr = {1, '2', 'c'}
for i=1, #myArr do  -- #myArr 是取 myArr 的长度
    print(myArr[i])
end

