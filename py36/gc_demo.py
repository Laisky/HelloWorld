import gc



class A(object):
    pass

class B(object):
    pass

gc.set_debug(gc.DEBUG_STATS | gc.DEBUG_LEAK)
a = A()
b = B()
a.b = b
b.a = a
del a
del b
gc.collect()
