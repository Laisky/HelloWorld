# https://github.com/M-o-a-T/aioping

import asyncio
from aioping import Ping

async def do_ping(addr):
    ping = Ping(addr, timeout=10)
    await ping.init()
    res = await ping.single()
    print(res)
    # ping.close()


# fs = [asyncio.ensure_future(do_ping('172.16.4.85')) for _ in range(100)]
fs = [asyncio.ensure_future(do_ping('127.0.0.1')) for _ in range(500)]
f = asyncio.wait(fs)


loop = asyncio.get_event_loop()
loop.run_until_complete(f)
