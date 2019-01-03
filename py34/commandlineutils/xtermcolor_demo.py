from xtermcolor import colorize


for i in range(16):
    print(i, colorize('Hello, world', ansi=i))
