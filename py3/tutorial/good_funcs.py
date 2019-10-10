"""
这样写会好很多
"""

def step1():
    return "yoo"


def step2(v):
    return f"hello, {v}"


def step3(v):
    return f"you know nothing, {v}"


def main():
    r1 = step1()
    r2 = step2(r1)
    step3(r2)
