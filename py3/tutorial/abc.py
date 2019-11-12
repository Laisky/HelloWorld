from abc import ABC, abstractmethod, abstractproperty

class ThingsABC(ABC):
    @abstractproperty
    def etable(self):
        pass


class BaseFood(ThingsABC):
    etable = True


class BirdABC(ABC):
    """
    在抽象类中定义抽象方法和属性，
    实例化的时候会自动检查这些抽象方法和方法必须已被实现，否则会抛出一场。

    具体实现的方法多种多样，比如直接在类里定义，或者多继承等等
    """
    @abstractmethod
    def fly(self):
        pass

    @abstractmethod
    def eat(self, food: BaseFood):
        pass


class BaseBird(BirdABC):
    """
    可以定义一些鸟类都应该有的通用属性和方法
    """
    pass


class Robin(BaseBird):
    """
    定义一些知更鸟特有的属性和方法
    """
#     def fly(self):
#         pass

#     def eat(self, foold: BaseFood):
#         pass


r = Robin()  # 会报错，因为没有实现抽象方法

# ---------------------------------------------------------------------------
# TypeError                                 Traceback (most recent call last)
# <ipython-input-1-a4984ec6275b> in <module>
#      45
#      46
# ---> 47 r = Robin()  # 会报错，因为没有实现抽象方法

# TypeError: Can't instantiate abstract class Robin with abstract methods eat, fly
