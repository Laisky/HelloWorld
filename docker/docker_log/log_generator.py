import time
import random
from textwrap import dedent


def get_log_msg():
    normal_log = '2018-01-02 10:00:00 DEBUG some normal log'
    error_log = dedent('''2018-01-02 13:11:00 ERROR xxx:
        error line 1
        error line 2
        error line 3
        error line 4
            trace msg
        ''')
    cp_log = '2018-01-02 10:00:00 INFO c.p. some normal log'
    r = random.random()
    if r < 0.5:
        return normal_log
    elif r < 0.8:
        return cp_log
    else:
        return error_log


def main():
    while 1:
        print(get_log_msg())
        time.sleep(1)


if __name__ == '__main__':
    main()
