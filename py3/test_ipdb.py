import ipdb


a = 10
BREAK = False

while not BREAK:
    a += 1
    ipdb.set_trace()
