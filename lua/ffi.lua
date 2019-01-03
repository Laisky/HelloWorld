----------------------------------------
-- 最简单的示例
----------------------------------------
local ffi = require("ffi")

-- 引入 c 代码
ffi.cdef[[
int printf(const char *fmt, ...);
]]

-- 通过 ffi.C.xxx 直接调用 C 代码中的函数
ffi.C.printf("Hello %s!", "world")

----------------------------------------
-- C struct 绑定 lua table
----------------------------------------
local ffi = require("ffi")
-- 定义 C struct
ffi.cdef[[
typedef struct { double x, y; } point_t;
]]

-- 将 lua mt 绑定到结构体上
local point
local mt = {
  __add = function(a, b) return point(a.x+b.x, a.y+b.y) end,
  __len = function(a) return math.sqrt(a.x*a.x + a.y*a.y) end,
  __index = {
    area = function(a) return a.x*a.x + a.y*a.y end,
  },
}
point = ffi.metatype("point_t", mt)

-- 在结构体上调用绑定的方法
local a = point(3, 4)
print(a.x, a.y)  --> 3  4
print(#a)        --> 5
print(a:area())  --> 25
local b = a + point(0.5, 8)
print(#b)        --> 12.5
