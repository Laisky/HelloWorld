from concurrent.futures import ThreadPoolExecutor, wait
from typing import Dict
from threading import Event


V_KEY = "key"


def worker(evt: Event, data: Dict[str, int]):
    evt.wait()
    for _ in range(100000):
        data[V_KEY] += 1


def main():
    data = {V_KEY: 0}
    evt = Event()
    executor = ThreadPoolExecutor(max_workers=10)
    fs = [executor.submit(worker, evt, data) for _ in range(10)]
    evt.set()
    wait(fs)
    print(data)  # not equal to 10*100000


if __name__ == "__main__":
    main()
