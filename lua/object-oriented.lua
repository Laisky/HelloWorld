--[[
Lua 的面向对象实现

]]--

-- 元类
local MetaClass = {}

-- 构建函数
function MetaClass:new (balance)
  balance = balance or 0
  -- 本身找不到的会去 __index 找
  -- 返回创建的新对象
  o = setmetatable({}, {__index = self})
  o.balance = balance
  return o
end

-- 定义实例方法
-- :xxx() 相当于 .xxx(self)
function MetaClass:deposit (v)
  self.balance = self.balance + v
end

function MetaClass:withdraw (v)
  if self.balance > v then
    self.balance = self.balance - v
  else
    error("insufficient funds")
  end
end

function MetaClass:show()
  print("balance: ", self.balance)
end

-- 实例测试
oa = MetaClass:new(100)
ob = MetaClass:new(200)

oa:deposit(50)
oa:withdraw(20)
oa:show()

ob:deposit(50)
ob:withdraw(20)
ob:show()

-- 继承
local ChildMetaClass = setmetatable({}, {__index=MetaClass})

function ChildMetaClass:showMore()
  print("Child show", self.balance)
end

oc = ChildMetaClass:new(300)
oc:deposit(50)
oc:withdraw(20)
oc:show()
oc:showMore()
