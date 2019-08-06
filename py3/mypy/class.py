from typing import Type


class Base:
    pass


class BaseB:
    pass


class Child(Base):
    pass


def type_check(val: Type[Base]):
    pass


type_check(Base)     # ok
type_check(Child)    # ok
type_check(BaseB)    # error
