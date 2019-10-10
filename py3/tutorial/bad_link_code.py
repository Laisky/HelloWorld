"""
这是很糟糕的链式调用
"""

def main():
    func1()


def func1():
    return func2()

def func2():
    return func3()

def func3():
    return "shit"
