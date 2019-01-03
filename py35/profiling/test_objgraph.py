# import cProfile
# import pstats
import objgraph

from base import slowest_replace, slow_replace, \
    fast_replace, fastest_replace


def main():
    orignal_str = '  41 414- 34(#$&*@#&$  f)'
    objgraph.show_growth()
    for _ in range(10001):
        slowest_replace(orignal_str=orignal_str)
        slow_replace(orignal_str=orignal_str)
        fast_replace(orignal_str=orignal_str)
        fastest_replace(orignal_str=orignal_str)

    objgraph.show_growth()

if __name__ == '__main__':
    main()
    # cProfile.run("main()", 'timeit')
    # p = pstats.Stats('timeit')
    # p.sort_stats('tottime')
    # p.print_stats()
