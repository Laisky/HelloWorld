import traceback
import asyncio
import aioping


async def do_ping(host):
    try:
        delay = await aioping.ping(host) * 1000
        print("Ping response in %s ms" % delay)
    except TimeoutError:
        print("Timed out")


fs = [asyncio.ensure_future(do_ping('172.16.4.85')) for _ in range(30)]
# fs = [asyncio.ensure_future(do_ping('127.0.0.1')) for _ in range(50)]
f = asyncio.wait(fs)


loop = asyncio.get_event_loop()
loop.run_until_complete(f)
