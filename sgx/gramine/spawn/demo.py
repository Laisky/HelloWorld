import time

from multiprocessing import set_start_method, get_start_method, get_all_start_methods

from concurrent.futures import (
    ThreadPoolExecutor,
    ProcessPoolExecutor,
    wait,
    ALL_COMPLETED,
    as_completed,
)


def foo():
    time.sleep(1)


def main():
    executor = ProcessPoolExecutor(max_workers=100)

    fs = []

    for i in range(200):
        fs.append(executor.submit(foo))

    for f in as_completed(fs):
        f.result()

    wait(fs, return_when=ALL_COMPLETED)
    print("done")


if __name__ == "__main__":
    print(get_all_start_methods())
    # print(get_start_method())
    set_start_method("forkserver")
    main()
