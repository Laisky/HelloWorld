import pstats

import pprofile

from base import slowest_replace, slow_replace, \
    fast_replace, fastest_replace


prof = pprofile.Profile()


def main():
    orignal_str = '  41 414- 34(#$&*@#&$  f)'
    with prof():
        for _ in range(5000):
            slowest_replace(orignal_str=orignal_str)
            slow_replace(orignal_str=orignal_str)
            fast_replace(orignal_str=orignal_str)
            fastest_replace(orignal_str=orignal_str)


if __name__ == '__main__':
    main()
    p = pstats.Stats(prof)
    p.sort_stats('tottime')
    p.print_stats()
