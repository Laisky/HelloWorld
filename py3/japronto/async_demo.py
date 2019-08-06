# examples/2_async/async.py
import asyncio
import time

from japronto import Application


# This is a synchronous handler.
def synchronous(request):
    time.sleep(0.1)
    return request.Response(text='I am synchronous!')


# This is an asynchronous handler, it spends most of the time in the event loop.
# It wakes up every second 1 to print and finally returns after 3 seconds.
# This does let other handlers to be executed in the same processes while
# from the point of view of the client it took 3 seconds to complete.
async def asynchronous(request):
    # for i in range(1, 4):
    #     await asyncio.sleep(1)
        # print(i, 'seconds elapsed')

    await asyncio.sleep(0.1)
    return request.Response(text='3 seconds elapsed')


def main():
    app = Application()

    r = app.router
    r.add_route('/sync', synchronous)
    r.add_route('/async', asynchronous)

    app.run('localhost', 5000)


if __name__ == '__main__':
    main()
