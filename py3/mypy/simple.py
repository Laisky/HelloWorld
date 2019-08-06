# fib.py
from typing import Iterator


def fib(n: int) -> Iterator[int]:
    a, b = 0, 1
    while a < n:
        yield a
        a, b = b, a + b

i = fib(3.2)
# 执行 $ mypy fib.py
# 会报错：
# fib.py:11: error: Argument 1 to "fib" has incompatible type "float"; expected "int"
