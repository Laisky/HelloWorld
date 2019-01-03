.RECIPEPREFIX = "    "

# <target> : <prerequisites>
# [tab]  <commands>

.PHONY: clean
b.txt:
	# 初始化依赖
	echo "hello, " > b.txt

.PHONY: clean
c.txt:
	# 初始化依赖
	echo "world!" >> c.txt

a.txt: b.txt c.txt
	# 简单的依赖
	cat b.txt c.txt > a.txt

shell:
	# 跨行
	@export foo=bar; \
	echo "foo=$$foo"

