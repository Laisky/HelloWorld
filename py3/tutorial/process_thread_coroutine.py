"""
✗ python process_thread_coroutine.py

[2019-08-11 09:09:37,670Z - INFO - kipp] - main running...
[2019-08-11 09:09:37,671Z - INFO - kipp] - coroutine_main running...
[2019-08-11 09:09:37,671Z - INFO - kipp] - io_blocking_task running...
[2019-08-11 09:09:37,690Z - INFO - kipp] - coroutine_task running...
[2019-08-11 09:09:37,691Z - INFO - kipp] - coroutine_error running...
[2019-08-11 09:09:37,691Z - INFO - kipp] - coroutine_error end, cost 0.00s
[2019-08-11 09:09:37,693Z - INFO - kipp] - cpu_blocking_task running...
[2019-08-11 09:09:38,674Z - INFO - kipp] - io_blocking_task end, cost 1.00s
[2019-08-11 09:09:38,695Z - INFO - kipp] - coroutine_task end, cost 1.00s
[2019-08-11 09:09:39,580Z - INFO - kipp] - cpu_blocking_task end, cost 1.89s
[2019-08-11 09:09:39,582Z - INFO - kipp] - coroutine_main got [None, AttributeError('yo'), None, None]
[2019-08-11 09:09:39,582Z - INFO - kipp] - coroutine_main end, cost 1.91s
[2019-08-11 09:09:39,582Z - INFO - kipp] - main end, cost 1.91s
"""


from time import sleep, time
from asyncio import get_event_loop, sleep as asleep, gather, ensure_future, iscoroutine
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, wait
from functools import wraps

from kipp.utils import get_logger


logger = get_logger()


N_FORK = 4
N_THREADS = 10

thread_executor = ThreadPoolExecutor(max_workers=N_THREADS)
process_executor = ProcessPoolExecutor(max_workers=N_FORK)
ioloop = get_event_loop()


def timer(func):
    @wraps(func)
    def wrapper(*args, **kw):
        logger.info(f"{func.__name__} running...")
        start_at = time()
        try:
            r = func(*args, **kw)
        finally:
            logger.info(f"{func.__name__} end, cost {time() - start_at:.2f}s")

    return wrapper


def async_timer(func):
    @wraps(func)
    async def wrapper(*args, **kw):
        logger.info(f"{func.__name__} running...")
        start_at = time()
        try:
            return await func(*args, **kw)
        finally:
            logger.info(f"{func.__name__} end, cost {time() - start_at:.2f}s")

    return wrapper


@timer
def io_blocking_task():
    """I/O 型阻塞调用"""
    sleep(1)


@timer
def cpu_blocking_task():
    """CPU 型阻塞调用"""
    for _ in range(1 << 26):
        pass


@async_timer
async def coroutine_task():
    """异步协程调用"""
    await asleep(1)


@async_timer
async def coroutine_error():
    """会抛出异常的协程调用"""
    raise AttributeError("yo")


@async_timer
async def coroutine_main():
    ioloop = get_event_loop()
    r = await gather(
        coroutine_task(),
        coroutine_error(),
        ioloop.run_in_executor(thread_executor, io_blocking_task),
        ioloop.run_in_executor(process_executor, cpu_blocking_task),
        return_exceptions=True,
    )
    logger.info(f"coroutine_main got {r}")


@timer
def main():
    get_event_loop().run_until_complete(coroutine_main())


if __name__ == "__main__":
    main()
