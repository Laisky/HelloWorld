# import cProfile
# import pstats

from base import slowest_replace, slow_replace, \
    fast_replace, fastest_replace


@profile
def main():
    orignal_str = '  41 414- 34(#$&*@#&$  f)'
    for _ in range(10000):
        slowest_replace(orignal_str=orignal_str)
        slow_replace(orignal_str=orignal_str)
        fast_replace(orignal_str=orignal_str)
        fastest_replace(orignal_str=orignal_str)


if __name__ == '__main__':
    main()
    # cProfile.run("main()", 'timeit')
    # p = pstats.Stats('timeit')
    # p.sort_stats('tottime')
    # p.print_stats()
